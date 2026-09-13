import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import Icon from "./Icon.jsx";

const ProfileTab = ({ onNameLoaded }) => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showProfileTip, setShowProfileTip] = useState(true);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [college, setCollege] = useState("");
  const [branch, setBranch] = useState("");
  const [year, setYear] = useState("");

  const [profilePicture, setProfilePicture] = useState("");
  const [signature, setSignature] = useState("");

  const [profilePicturePreview, setProfilePicturePreview] = useState("");
  const [signaturePreview, setSignaturePreview] = useState("");

  const profilePictureRef = useRef(null);
  const signatureRef = useRef(null);
  const editFormRef = useRef(null);

  /* =========================================================
     LOAD PROFILE
  ========================================================= */

  const loadProfile = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/auth/profile`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const user = res.data.user;

      setFullName(user.fullName || "");
      onNameLoaded?.(user.fullName || "");
      setEmail(user.email || "");
      setMobile(user.mobile || "");
      setCollege(user.college || "");
      setBranch(user.branch || "");
      setYear(user.year != null ? String(user.year) : "");
      setProfilePicture(user.profilePicture || "");
      setSignature(user.signature || "");
    } catch (err) {
      console.log(err);

      if (err.response?.status === 401 || err.response?.status === 404) {
        localStorage.clear();
        navigate("/login", { replace: true });
        return;
      }

      Swal.fire({
        icon: "error",
        title: "Failed to load profile",
        text: err.response?.data?.message || "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenEdit = () => {
    setIsEditing(true);

    requestAnimationFrame(() => {
      editFormRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  };

  /* =========================================================
     EFFECTS
  ========================================================= */

  useEffect(() => {
    requestAnimationFrame(() => loadProfile());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    return () => {
      if (profilePicturePreview.startsWith("blob:")) {
        URL.revokeObjectURL(profilePicturePreview);
      }

      if (signaturePreview.startsWith("blob:")) {
        URL.revokeObjectURL(signaturePreview);
      }
    };
  }, [profilePicturePreview, signaturePreview]);

  /* =========================================================
     FILE PREVIEW
  ========================================================= */

  const revokePreviewUrl = (url) => {
    if (url?.startsWith("blob:")) {
      URL.revokeObjectURL(url);
    }
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files?.[0];

    revokePreviewUrl(profilePicturePreview);

    if (!file) {
      setProfilePicturePreview("");
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setProfilePicturePreview(previewUrl);
  };

  const handleSignatureChange = (e) => {
    const file = e.target.files?.[0];

    revokePreviewUrl(signaturePreview);

    if (!file) {
      setSignaturePreview("");
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setSignaturePreview(previewUrl);
  };

  /* =========================================================
     SUBMIT PROFILE
  ========================================================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedMobile = mobile.trim();
    const trimmedCollege = college.trim();
    const trimmedBranch = branch.trim();
    const trimmedYear = year.trim();
    const numericYear = Number(trimmedYear);
    const profilePictureFile = profilePictureRef.current?.files?.[0];
    const signatureFile = signatureRef.current?.files?.[0];
    const allowedImageTypes = ["image/jpeg", "image/png", "image/webp"];
    const maxFileSize = 2 * 1024 * 1024;

    if (!trimmedMobile) {
      Swal.fire({
        icon: "error",
        title: "Validation Failed",
        text: "Mobile number is required",
      });
      return;
    }

    if (!trimmedCollege) {
      Swal.fire({
        icon: "error",
        title: "Validation Failed",
        text: "College is required",
      });
      return;
    }

    if (!trimmedBranch) {
      Swal.fire({
        icon: "error",
        title: "Validation Failed",
        text: "Branch is required",
      });
      return;
    }

    if (!trimmedYear) {
      Swal.fire({
        icon: "error",
        title: "Validation Failed",
        text: "Year is required",
      });
      return;
    }

    if (Number.isNaN(numericYear) || numericYear < 1 || numericYear > 7) {
      Swal.fire({
        icon: "error",
        title: "Validation Failed",
        text: "Year must be a number between 1 and 7",
      });
      return;
    }

    for (const file of [profilePictureFile, signatureFile]) {
      if (!file) {
        continue;
      }

      if (!allowedImageTypes.includes(file.type)) {
        Swal.fire({
          icon: "error",
          title: "Validation Failed",
          text: "Profile picture and signature must be JPG, PNG, or WebP files",
        });
        return;
      }

      if (file.size > maxFileSize) {
        Swal.fire({
          icon: "error",
          title: "Validation Failed",
          text: "Each file must be 2MB or smaller",
        });
        return;
      }
    }

    setSaving(true);

    try {
      const token = localStorage.getItem("token");

      const formData = new FormData();

      formData.append("mobile", trimmedMobile);
      formData.append("college", trimmedCollege);
      formData.append("branch", trimmedBranch);
      formData.append("year", numericYear);

      if (profilePictureFile) {
        formData.append("profilePicture", profilePictureFile);
      }

      if (signatureFile) {
        formData.append("signature", signatureFile);
      }

      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/auth/profile`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const user = res.data.user;

      setFullName(user.fullName || "");
      onNameLoaded?.(user.fullName || "");
      setEmail(user.email || "");
      setMobile(user.mobile || "");
      setCollege(user.college || "");
      setBranch(user.branch || "");
      setYear(user.year != null ? String(user.year) : "");

      setProfilePicture(user.profilePicture || "");
      setSignature(user.signature || "");

      try {
        const storedUser = JSON.parse(
          localStorage.getItem("user") || "{}"
        );

        localStorage.setItem(
          "user",
          JSON.stringify({
            ...storedUser,
            fullName: user.fullName || "",
            email: user.email || "",
            mobile: user.mobile || "",
            college: user.college || "",
            branch: user.branch || "",
            year: user.year != null ? user.year : "",
            profilePicture: user.profilePicture || "",
            signature: user.signature || "",
          })
        );

        window.dispatchEvent(new Event("storage"));
      } catch (storageErr) {
        console.log(storageErr);
      }

      revokePreviewUrl(profilePicturePreview);
      revokePreviewUrl(signaturePreview);
      setProfilePicturePreview("");
      setSignaturePreview("");

      if (profilePictureRef.current) {
        profilePictureRef.current.value = "";
      }

      if (signatureRef.current) {
        signatureRef.current.value = "";
      }

      setIsEditing(false);

      Swal.fire({
        icon: "success",
        title: "Profile Updated",
        text: res.data.message,
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err) {
      console.log(err);

      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: err.response?.data?.message || "Something went wrong",
      });
    } finally {
      setSaving(false);
    }
  };

  /* =========================================================
     CANCEL EDIT
  ========================================================= */

  const handleCancelEdit = async () => {
    revokePreviewUrl(profilePicturePreview);
    revokePreviewUrl(signaturePreview);

    setIsEditing(false);
    setProfilePicturePreview("");
    setSignaturePreview("");

    if (profilePictureRef.current) {
      profilePictureRef.current.value = "";
    }

    if (signatureRef.current) {
      signatureRef.current.value = "";
    }

    await loadProfile();
  };

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600" />

          <p className="text-sm font-semibold text-slate-500">
            Loading your profile...
          </p>
        </div>
      </div>
    );
  }

  /* =========================================================
     MAIN UI
  ========================================================= */

  return (
    <div className="space-y-5">
      {/* PROFILE HERO */}

      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#e8f2ff] via-[#eef6ff] to-[#dcecff] px-6 py-7 sm:px-10">
        <div className="absolute -right-10 -top-16 h-52 w-52 rounded-full bg-white/50 blur-2xl" />
        <div className="absolute -bottom-20 right-20 h-56 w-56 rounded-full bg-blue-200/20 blur-3xl" />

        <div className="relative flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
          {/* USER */}

          <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-center">
            <div className="relative shrink-0">
              {profilePicture ? (
                <img
                  src={profilePicture}
                  alt="Profile"
                  className="h-36 w-36 rounded-full border-4 border-white object-cover shadow-lg"
                />
              ) : (
                <div className="flex h-36 w-36 items-center justify-center rounded-full border-4 border-white bg-blue-100 text-blue-600 shadow-lg">
                  <Icon name="user" size={58} />
                </div>
              )}

              <button
                type="button"
                onClick={handleOpenEdit}
                className="absolute bottom-1 right-1 flex h-11 w-11 items-center justify-center rounded-full border-4 border-white bg-blue-600 text-white shadow-md transition hover:bg-blue-700"
                title="Edit profile"
              >
                <Icon name="camera" size={19} />
              </button>
            </div>

            <div className="text-center sm:text-left">
              <h2 className="text-3xl font-extrabold tracking-tight text-[#0b1935]">
                {fullName || "Student"}
              </h2>

              <div className="mt-2 flex items-center justify-center gap-2 text-slate-600 sm:justify-start">
                <Icon name="mail" size={21} />
                <span className="text-base">{email || "-"}</span>
              </div>

              <span className="mt-3 inline-flex rounded-full bg-blue-100 px-4 py-1.5 text-sm font-bold text-blue-600">
                Student
              </span>

              <p className="mt-3 text-sm italic text-slate-500">
                "Stay curious, keep learning!"
              </p>
            </div>
          </div>

          {/* QUOTE */}

          <div className="hidden border-l border-blue-200/70 pl-8 lg:block lg:max-w-[360px]">
            <p className="text-lg font-medium italic leading-8 text-[#172d50]">
              “Discipline today
              <br />
              builds a better tomorrow.”
            </p>

            <div className="mt-4 h-1 w-9 rounded-full bg-blue-600" />
          </div>
        </div>
      </div>

      {/* =================================================
          INFORMATION + DOCUMENTS
      ================================================= */}

      {!isEditing ? (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.25fr_1fr]">
          {/* PERSONAL INFORMATION */}

          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:p-7">
            <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                  <Icon name="college" size={22} />
                </div>

                <h3 className="text-xl font-extrabold text-[#0b1935]">
                  Personal Information
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-blue-700"
              >
                <Icon name="edit" size={17} />
                Edit Profile
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {/* FULL NAME */}

              <div className="grid grid-cols-[36px_105px_1fr] items-center gap-2 py-3">
                <div className="text-slate-500">
                  <Icon name="user" size={22} />
                </div>

                <span className="text-sm font-medium text-slate-500">
                  Full Name
                </span>

                <span className="text-sm font-semibold text-[#17213a] sm:text-base">
                  {fullName || "-"}
                </span>
              </div>

              {/* EMAIL */}

              <div className="grid grid-cols-[36px_105px_1fr] items-center gap-2 py-3">
                <div className="text-slate-500">
                  <Icon name="mail" size={22} />
                </div>

                <span className="text-sm font-medium text-slate-500">
                  Email
                </span>

                <span className="break-all text-sm font-semibold text-[#17213a] sm:text-base">
                  {email || "-"}
                </span>
              </div>

              {/* MOBILE */}

              <div className="grid grid-cols-[36px_105px_1fr] items-center gap-2 py-3">
                <div className="text-slate-500">
                  <Icon name="phone" size={22} />
                </div>

                <span className="text-sm font-medium text-slate-500">
                  Mobile
                </span>

                <span className="text-sm font-semibold text-[#17213a] sm:text-base">
                  {mobile || "-"}
                </span>
              </div>

              {/* COLLEGE */}

              <div className="grid grid-cols-[36px_105px_1fr] items-center gap-2 py-3">
                <div className="text-slate-500">
                  <Icon name="college" size={22} />
                </div>

                <span className="text-sm font-medium text-slate-500">
                  College
                </span>

                <span className="text-sm font-semibold text-[#17213a] sm:text-base">
                  {college || "-"}
                </span>
              </div>

              {/* BRANCH */}

              <div className="grid grid-cols-[36px_105px_1fr] items-center gap-2 py-3">
                <div className="text-slate-500">
                  <Icon name="book" size={22} />
                </div>

                <span className="text-sm font-medium text-slate-500">
                  Branch
                </span>

                <span className="text-sm font-semibold text-[#17213a] sm:text-base">
                  {branch || "-"}
                </span>
              </div>

              {/* YEAR */}

              <div className="grid grid-cols-[36px_105px_1fr] items-center gap-2 py-3">
                <div className="text-slate-500">
                  <Icon name="calendar" size={22} />
                </div>

                <span className="text-sm font-medium text-slate-500">Year</span>

                <span className="text-sm font-semibold text-[#17213a] sm:text-base">
                  {year || "-"}
                </span>
              </div>
            </div>
          </div>

          {/* DOCUMENTS */}

          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:p-7">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                <Icon name="image" size={22} />
              </div>

              <h3 className="text-xl font-extrabold text-[#0b1935]">
                Documents
              </h3>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              {/* PROFILE PICTURE */}

              <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
                <p className="mb-4 text-sm font-bold text-slate-600">
                  Profile Picture
                </p>

                <div className="flex min-h-[170px] items-center justify-center">
                  {profilePicture ? (
                    <div className="relative">
                      <img
                        src={profilePicture}
                        alt="Profile"
                        className="h-36 w-36 rounded-full border-4 border-white object-cover shadow-md"
                      />

                      <button
                        type="button"
                        onClick={() => setIsEditing(true)}
                        className="absolute bottom-0 right-0 flex h-10 w-10 items-center justify-center rounded-full border-4 border-white bg-slate-500 text-white shadow-md"
                      >
                        <Icon name="camera" size={17} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex h-36 w-36 items-center justify-center rounded-full bg-blue-50 text-blue-400">
                      <Icon name="user" size={55} />
                    </div>
                  )}
                </div>

                <div className="mt-4 flex items-center justify-center gap-2 rounded-full bg-emerald-50 py-2 text-sm font-bold text-emerald-600">
                  <Icon name="check" size={16} />
                  {profilePicture ? "Uploaded" : "Not Uploaded"}
                </div>
              </div>

              {/* SIGNATURE */}

              <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
                <p className="mb-4 text-sm font-bold text-slate-600">
                  Signature
                </p>

                <div className="flex min-h-[170px] items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-white p-3">
                  {signature ? (
                    <img
                      src={signature}
                      alt="Signature"
                      className="max-h-32 max-w-full object-contain"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-slate-400">
                      <Icon name="edit" size={38} />
                      <span className="text-xs font-semibold">
                        No signature
                      </span>
                    </div>
                  )}
                </div>

                <div className="mt-4 flex items-center justify-center gap-2 rounded-full bg-emerald-50 py-2 text-sm font-bold text-emerald-600">
                  <Icon name="check" size={16} />
                  {signature ? "Uploaded" : "Not Uploaded"}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* =================================================
           EDIT FORM
        ================================================= */

        <form
          ref={editFormRef}
          onSubmit={handleSubmit}
          className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:p-7"
        >
          <div className="mb-7">
            <h3 className="text-xl font-extrabold text-[#0b1935]">
              Edit Profile
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Update your information and profile documents.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {/* FULL NAME */}

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-600">
                Full Name
              </label>

              <input
                type="text"
                value={fullName}
                readOnly
                className="w-full rounded-xl border border-slate-200 bg-slate-100 px-4 py-3 text-sm font-medium text-slate-500 outline-none"
              />
            </div>

            {/* EMAIL */}

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-600">
                Email
              </label>

              <input
                type="email"
                value={email}
                readOnly
                className="w-full rounded-xl border border-slate-200 bg-slate-100 px-4 py-3 text-sm font-medium text-slate-500 outline-none"
              />
            </div>

            {/* MOBILE */}

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-600">
                Mobile
              </label>

              <input
                type="text"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                placeholder="Enter mobile number"
              />
            </div>

            {/* COLLEGE */}

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-600">
                College
              </label>

              <input
                type="text"
                value={college}
                onChange={(e) => setCollege(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                placeholder="Enter college"
              />
            </div>

            {/* BRANCH */}

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-600">
                Branch
              </label>

              <input
                type="text"
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                placeholder="Enter branch"
              />
            </div>

            {/* YEAR */}

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-600">
                Year
              </label>

              <input
                type="text"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                placeholder="Enter year"
              />
            </div>

            {/* PROFILE PICTURE */}

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-600">
                Profile Picture
              </label>

              <input
                ref={profilePictureRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleProfilePictureChange}
                className="block w-full cursor-pointer rounded-xl border border-slate-200 bg-white text-sm text-slate-600 file:mr-4 file:border-0 file:bg-blue-50 file:px-4 file:py-3 file:font-bold file:text-blue-600 hover:file:bg-blue-100"
              />

              {profilePicturePreview && (
                <div className="mt-4">
                  <p className="mb-2 text-xs font-bold text-slate-500">
                    Preview
                  </p>

                  <img
                    src={profilePicturePreview}
                    alt="Profile Preview"
                    className="h-28 w-28 rounded-full border-4 border-white object-cover shadow-md"
                  />
                </div>
              )}
            </div>

            {/* SIGNATURE */}

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-600">
                Signature
              </label>

              <input
                ref={signatureRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleSignatureChange}
                className="block w-full cursor-pointer rounded-xl border border-slate-200 bg-white text-sm text-slate-600 file:mr-4 file:border-0 file:bg-blue-50 file:px-4 file:py-3 file:font-bold file:text-blue-600 hover:file:bg-blue-100"
              />

              {signaturePreview && (
                <div className="mt-4">
                  <p className="mb-2 text-xs font-bold text-slate-500">
                    Preview
                  </p>

                  <div className="flex h-28 items-center rounded-xl border border-slate-200 bg-slate-50 p-3">
                    <img
                      src={signaturePreview}
                      alt="Signature Preview"
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mt-7 flex flex-col gap-3 border-t border-slate-100 pt-6 sm:flex-row">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400"
            >
              {saving ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  Saving...
                </>
              ) : (
                <>
                  <Icon name="check" size={18} />
                  Save Changes
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleCancelEdit}
              disabled={saving}
              className="rounded-xl bg-slate-100 px-6 py-3.5 text-sm font-bold text-slate-700 transition hover:bg-slate-200 disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* PROFILE TIP */}

      {!isEditing && showProfileTip && (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#e8f2ff] to-[#eef6ff] px-5 py-5 sm:px-7">
          <button
            type="button"
            onClick={() => setShowProfileTip(false)}
            className="absolute right-5 top-5 text-blue-500 transition hover:text-blue-700"
            aria-label="Dismiss"
          >
            <Icon name="x" size={20} />
          </button>

          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
              <Icon name="lightbulb" size={28} />
            </div>

            <div>
              <h4 className="text-base font-extrabold text-blue-600 sm:text-lg">
                Keep your profile updated
              </h4>

              <p className="mt-1 text-sm text-slate-500">
                Your information helps us provide a better experience during the
                workshop.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileTab;
