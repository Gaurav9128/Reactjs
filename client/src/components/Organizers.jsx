import chairman from "../assets/committee/person1.png";
import president from "../assets/committee/person2.png";
import director from "../assets/committee/person3.png";

import proPresident from "../assets/committee/person4.png";
import dean from "../assets/committee/person3.png";
import international from "../assets/committee/person3.png";
import HOD from "../assets/committee/person9.png";
import Registrar from "../assets/committee/person7.png";
import Dean from "../assets/committee/person8.png";
import AP from "../assets/committee/person10.jpeg";
import GJ from "../assets/committee/person11.jpeg";
import ExecutiveCards from "./ExecutiveCards";



const chiefPatrons = [
  {
    image: chairman,
    name: "Shri Shashikant Singhi",
    designation: "Chairperson",
    organization: "Poornima University",
  },
  {
    image: president,
    name: "Dr. Suresh Chand Padhy",
    designation: "President",
    organization: "Poornima University",
  },
  {
    image: director,
    name: "Ar. Rahul Singhi",
    designation: "Director",
    organization: "Poornima University",
  },
];


const generalChairs = [

  {
    image: proPresident,
    name: "Dr. Manoj Gupta",
    designation: "Pro-President (FET & FCE)",
    organization: "Poornima University",
  },

];

const coGeneralChairs = [

  {
    image: HOD,
    name: "Dr. Savita Shiwani",
    designation: "HOD(FCE BCA Higher)",
    organization: "Poornima University",
  },
  {
    image: Registrar,
    name: "Dr. Devendra Somvanshi",
    designation: "Registrar",
    organization: "Poornima University",
  },
  {
    image: Dean,
    name: "Dr. Shikha Sharma",
    designation: "Dean, FCE",
    organization: "Poornima University",
  },

];

const convener = [

  {
    image: AP,
    name: "Rishi kumar Jalwal",
    designation: "Assistant Professor",
    organization: "Poornima University",
  },
  {
    image: GJ,
    name: "Gaurav Jain",
    designation: "Assistant Professor",
    organization: "Poornima University",
  }
];



const CommitteeCard = ({ person }) => (

  <div
    className="
bg-white
rounded-2xl
sm:rounded-[24px]
shadow-lg
hover:shadow-2xl
transition-all
duration-300
py-8
sm:py-10
px-5
sm:px-8
text-center
border
border-[#edf2fb]
hover:-translate-y-2
h-full
"
  >


    <img
      src={person.image}
      alt={person.name}
      className="
w-28
h-28
sm:w-36
sm:h-36
lg:w-40
lg:h-40
rounded-full
object-cover
mx-auto
border-4
border-[#f5f7ff]
"
    />



    <h3
      className="
mt-6
sm:mt-8
text-xl
sm:text-2xl
lg:text-[25px]
font-semibold
text-[#111827]
break-words
"
    >
      {person.name}
    </h3>




    <p
      className="
mt-3
sm:mt-4
text-sm
sm:text-[15px]
font-medium
text-[#23439B]
leading-6
"
    >
      {person.designation}
    </p>




    <p
      className="
mt-3
sm:mt-4
text-xs
sm:text-sm
text-gray-500
leading-6
sm:leading-8
"
    >
      {person.organization}
    </p>



  </div>

);





const CommitteeSection = () => {

  return (

    <section className="bg-[#F7F8FC] py-14 sm:py-20 lg:py-24">


      <div
        className="
max-w-7xl
mx-auto
px-4
sm:px-6
"
      >



        {/* Chief Patrons */}

        <h2
          className="
text-center
text-xl
sm:text-2xl
lg:text-[25px]
font-bold
text-[#23439B]
uppercase
mb-10
sm:mb-16
tracking-wide
"
        >
          Chief Patrons
        </h2>




        <div
          className="
grid
grid-cols-1
sm:grid-cols-2
lg:grid-cols-3
gap-6
sm:gap-10
"
        >


          {
            chiefPatrons.map((item, index) => (

              <CommitteeCard
                key={index}
                person={item}
              />

            ))

          }


        </div>





        {/* General Chairs */}


        <h2
          className="
text-center
text-xl
sm:text-2xl
lg:text-[25px]
font-bold
text-[#23439B]
uppercase
mt-20
sm:mt-28
mb-10
sm:mb-16
tracking-wide
"
        >
          General Chairs
        </h2>





        <div
          className="
grid
grid-cols-1
sm:grid-cols-1
lg:grid-cols-1
gap-6
sm:gap-10
"
        >


          {
            generalChairs.map((item, index) => (

              <CommitteeCard
                key={index}
                person={item}
              />

            ))

          }


        </div>


        {/* CO-General Chairs */}


        <h2
          className="
text-center
text-xl
sm:text-2xl
lg:text-[25px]
font-bold
text-[#23439B]
uppercase
mt-20
sm:mt-28
mb-10
sm:mb-16
tracking-wide
"
        >
          CO-General Chairs
        </h2>





        <div
          className="
grid
grid-cols-1
sm:grid-cols-2
lg:grid-cols-3
gap-6
sm:gap-10
"
        >


          {
            coGeneralChairs.map((item, index) => (

              <CommitteeCard
                key={index}
                person={item}
              />

            ))

          }


        </div>

                

                {/* Convener */}


        <h2
          className="
text-center
text-xl
sm:text-2xl
lg:text-[25px]
font-bold
text-[#23439B]
uppercase
mt-20
sm:mt-28
mb-10
sm:mb-16
tracking-wide
"
        >
          Convener
        </h2>





        <div
          className="
grid
grid-cols-1
sm:grid-cols-1
lg:grid-cols-2
gap-6
sm:gap-10
"
        >


          {
            convener.map((item, index) => (

              <CommitteeCard
                key={index}
                person={item}
              />

            ))

          }


        </div>


      </div>



     <ExecutiveCards />
    </section>
    

  );

};


export default CommitteeSection;