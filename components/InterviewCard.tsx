import dayjs from 'dayjs';
import Image from "next/image";
import { getRandomInterviewCover } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import DisplayTechIcons from "./DisplayTechIcons";

const InterviewCard = ({ interviewId, userId, role, type, techstack, createdAt }: InterviewCardProps) => {
  const feedback = null as Feedback | null;
  const normalizedType = /mix/gi.test(type) ? 'Mixed' : type;
  const formattedDate = dayjs(feedback?.createdAt || createdAt || Date.now()).format('MMM D, YYYY');

  return (
    // Conteneur avec perspective
    <div className="group card-border w-[360px] max-sm:w-full min-h-96 [perspective:1000px]">
      {/* Carte transformable avec preserve-3d */}
      <div className="relative cursor-pointer rounded-xl shadow-lg p-6 transform-gpu transition-transform duration-700 ease-out [transform-style:preserve-3d] group-hover:[transform:rotateX(15deg)_rotateY(10deg)_translateZ(20px)] will-change-transform">
        
        {/* Badge - flotte au-dessus */}
        <div className="absolute top-0 right-0 px-4 py-2 rounded-bl-lg bg-light-600 z-10 [transform:translateZ(50px)]">
          <p className="badge-text font-medium">{normalizedType}</p>
        </div>

        {/* Section du haut */}
        <div>
          {/* Image profile - ressort encore plus */}
          <Image
            src={getRandomInterviewCover()}
            alt="cover image"
            width={90}
            height={90}
            className="rounded-full w-[90px] h-[90px] object-cover transition-transform duration-700 [transform:translateZ(60px)] group-hover:[transform:translateZ(80px)] shadow-lg"
          />

          {/* Titre */}
          <h3 className="mt-5 capitalize text-xl font-semibold transition-transform duration-700 [transform:translateZ(40px)] group-hover:[transform:translateZ(50px)]">
            {role} Interview
          </h3>

          {/* Informations date et score */}
          <div className="flex flex-row gap-5 mt-3">
            <div className="flex flex-row gap-2 items-center transition-transform duration-700 [transform:translateZ(35px)] group-hover:[transform:translateZ(45px)]">
              <Image src="/calendar.svg" alt="calendar" width={22} height={22} />
              <p>{formattedDate}</p>
            </div>

            <div className="flex flex-row gap-2 items-center transition-transform duration-700 [transform:translateZ(35px)] group-hover:[transform:translateZ(45px)]">
              <Image src="/star.svg" alt="star" width={22} height={22} />
              <p>{feedback?.totalScore || '---'}/100</p>
            </div>
          </div>

          {/* Description */}
          <p className="line-clamp-2 mt-5 text-gray-600 transition-transform duration-700 [transform:translateZ(30px)] group-hover:[transform:translateZ(40px)]">
            {feedback?.finalAssessment || "You haven't taken the interview yet. Take it now to improve your skills."}
          </p>
        </div>

        {/* Section du bas */}
        <div className="flex flex-row justify-between items-center mt-6">
          <div className="transition-transform duration-700 [transform:translateZ(25px)] group-hover:[transform:translateZ(35px)]">
            <DisplayTechIcons techStack={techstack} />
          </div>

          {/* Bouton avec lien */}
          <Link 
            href={feedback ? `/interview/${interviewId}/feedback` : `/interview/${interviewId}`}
            className="transition-transform duration-700 [transform:translateZ(25px)] group-hover:[transform:translateZ(45px)]"
          >
            <Button className="btn-primary shadow-lg">
              {feedback ? 'Check Feedback' : 'View Interview'}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default InterviewCard;