import React, { useEffect, useState } from "react";
import imgRalseiCocking1 from "@/assets/loadingConnexion/ralseiCooking/ralseiCooking_1.png";
import imgRalseiCocking2 from "@/assets/loadingConnexion/ralseiCooking/ralseiCooking_2.png";
import imgRalseiCocking3 from "@/assets/loadingConnexion/ralseiCooking/ralseiCooking_3.png";
import imgRalseiCocking4 from "@/assets/loadingConnexion/ralseiCooking/ralseiCooking_4.png";
import imgRalseiTea1 from "@/assets/loadingConnexion/ralseiTea/ralseiTea_1.png";
import imgRalseiTea2 from "@/assets/loadingConnexion/ralseiTea/ralseiTea_2.png";
import imgRalseiTea3 from "@/assets/loadingConnexion/ralseiTea/ralseiTea_3.png";
import imgRalseiTea4 from "@/assets/loadingConnexion/ralseiTea/ralseiTea_4.png";
import imgRalseiTea5 from "@/assets/loadingConnexion/ralseiTea/ralseiTea_5.png";
import imgRalseiTea6 from "@/assets/loadingConnexion/ralseiTea/ralseiTea_6.png";
import imgRalseiTea7 from "@/assets/loadingConnexion/ralseiTea/ralseiTea_7.png";
import imgRalseiTea8 from "@/assets/loadingConnexion/ralseiTea/ralseiTea_8.png";
import imgRalseiTea9 from "@/assets/loadingConnexion/ralseiTea/ralseiTea_9.png";
import imgRalseiTea10 from "@/assets/loadingConnexion/ralseiTea/ralseiTea_10.png";
import imgRalseiTea11 from "@/assets/loadingConnexion/ralseiTea/ralseiTea_11.png";
import teamRunning1 from "@/assets/loadingConnexion/teamRunning/teamRunning_1.png";
import teamRunning2 from "@/assets/loadingConnexion/teamRunning/teamRunning_2.png";
import teamRunning3 from "@/assets/loadingConnexion/teamRunning/teamRunning_3.png";
import teamRunning4 from "@/assets/loadingConnexion/teamRunning/teamRunning_4.png";

interface LoadingModalProps {
    title: string;
}

const IMAGES_RALSEI_COOKING=[
    imgRalseiCocking1,
    imgRalseiCocking2,
    imgRalseiCocking3,
    imgRalseiCocking4,
]
const IMAGES_RALSEI_TEA=[
    imgRalseiTea1,
    imgRalseiTea2,
    imgRalseiTea3,
    imgRalseiTea4,
    imgRalseiTea5,
    imgRalseiTea6,
    imgRalseiTea7,
    imgRalseiTea8,
    imgRalseiTea9,
    imgRalseiTea10,
    imgRalseiTea11,
]
const IMAGES_RUNNING_TEAM=[
    teamRunning1,
    teamRunning2,
    teamRunning3,
    teamRunning4,
]

const ANIMATION_PLAYLIST=[
    IMAGES_RALSEI_TEA,
    IMAGES_RALSEI_COOKING,
    IMAGES_RUNNING_TEAM
]

const LOADING_STEPS = [
    {text: "Réveil du serveur en cours..."},
    {text: "Préparation de votre inventaire..."},
    {text: "Vérification de la base de données..."},
    {text: "Comptage de vos paquets de pâtes..."}
];

const LoadingModal: React.FC<LoadingModalProps> = ({ title }) => {
    const [currentStepMessage, setCurrentStepMessage] = useState(0);
    const [currentAnimIndex, setCurrentAnimIndex] = useState(0);
    const [currentFrame, setCurrentFrame] = useState(0);
    const currentAnim = ANIMATION_PLAYLIST[currentAnimIndex];

    useEffect(() => {
        const intervalMessage = setInterval(() => {
            setCurrentStepMessage((prevStep) => (prevStep + 1) % LOADING_STEPS.length);
        }, 3000);
        const intervalFrame = setInterval(() => {
            setCurrentFrame((prev) => (prev + 1) % currentAnim.length);
        }, 400);
        const timeoutSwitch = setTimeout(() => {
            setCurrentAnimIndex((prevIndex) => (prevIndex + 1) % ANIMATION_PLAYLIST.length);
            setCurrentFrame(0);
        }, 10000);
        return () => {
            clearInterval(intervalMessage)
            clearInterval(intervalFrame)
            clearInterval(timeoutSwitch)};
    }, [currentAnimIndex, currentAnim.length]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/70 backdrop-blur-sm select-none pointer-events-auto">
            <div className="bg-white p-8 rounded-2xl
            shadow-2xl max-w-sm w-full mx-4 flex flex-col
            items-center text-center space-y-6 border border-gray-100
            transform transition-all duration-100 scale-100">
                <h3 className="titre">{title}</h3>

                <div className="w-36 h-36 flex items-center justify-center bg-gray-50 rounded-2xl border border-gray-50">
                    <img
                        src={currentAnim[currentFrame]}
                        alt="Ralsei animation"
                        className="w-full h-full object-contain"
                        style={{ imageRendering: "pixelated" }}
                    />
                </div>
                <p className="texte transition-all duration-500 ease-in-out">
                    {LOADING_STEPS[currentStepMessage].text}
                </p>

                <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-blue-600 h-1.5 w-1/3 animate-[shimmer_1.5s_infinite_linear] rounded-full"
                         style={{
                             animationName: 'shimmer',
                             animationDuration: '1.5s',
                             animationTimingFunction: 'linear',
                             animationIterationCount: 'infinite'
                         }}
                    />
                </div>
            </div>
        </div>
    );
};

export default LoadingModal;