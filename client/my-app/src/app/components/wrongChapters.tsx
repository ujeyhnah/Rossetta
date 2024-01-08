"use client"
import React, {useEffect, useState} from 'react';
import Link from 'next/link';
import Image, { StaticImageData } from 'next/image';
// import { useRouter } from 'next/router';
import "@/app/styles/condition_1.css"

import { usePathname, useRouter } from 'next/navigation';
import Chart from "@/app/components/donut";
import axios from "axios";

interface ChapterProps {
  imagePath?: StaticImageData;
  selectName: string;
  type: string;
  isdeaf: boolean;
}

interface CorrectData {
  chapter: number;
  paper_all_count: number;
  deaf_count: number;
  deaf_not_count: number;
}

const wrongChapters: React.FC<ChapterProps> = ({imagePath, selectName, type, isdeaf}) => {
   const userId = typeof window !== 'undefined' ? localStorage.getItem('id') : null;
   const accessToken = typeof window !== 'undefined' ? localStorage.getItem('accessToken'):null;
   const [islength, setIsChapLength] = useState<number>(0);
   const [correct, setCorrect] = useState<number[][]>([]);
   const currentPath = usePathname();
   let URL:string;
   let param = {};
   if (type=='word'){
       URL = "http://localhost:8000/api/wordwrongcount/"
       param = {
           id: userId, type: "단어", situation: selectName
       }
   }
   else if (type=='sentence'){
       URL = "http://localhost:8000/api/sentencewrongcount/"
       param = {
           id: userId, type:"문장"
       }
   }

   const setChapLength = (n: number): number[] => {
      return Array.from({ length: n }, (_, index) => index + 1);
    };

      useEffect(() => {
          axios.post(URL, param, {headers: {'Authorization': `Token ${accessToken}`}})
              .then((res) => {
                    const leng = res.data[selectName].length;
                    if (leng != undefined) {
                        setIsChapLength(leng)
                        console.log(islength);

                        const correctData: CorrectData[] = res.data[selectName];
                        console.log(correctData);

                      const correct: number[][] = correctData.map(item => [
                        item.paper_all_count,
                        item.deaf_count,
                        item.deaf_not_count
                      ]);

                    setCorrect(correct);
                    }
                })
              .catch((err) => {
                  console.log(err)
              });
      }, []);

    const chapters = setChapLength(islength);

  return (
    <div className="chapter">
      <div className="spot-area">
        <Image className='btn-image' src={imagePath} alt="btn-image" />
        <div className="gradient-overlay"></div>
        <span className="spot-text">{selectName}</span>
      </div>{islength > 0 &&(
        <div className="chapter-area">
            {chapters.map((chapterNumber, index) => (
              <Link href={`../../${currentPath}/${chapterNumber}/0`} key={index}>
                <div className="chapter-btn"><div className="dnchart">
                    <Chart
                        allCount={correct[index][0]}
                        correct={isdeaf ? correct[index][2] : correct[index][1]}
                      />
                </div>
                    <div className='btnText'>Chapter {chapterNumber}</div></div>
              </Link>
            ))}
        </div>)}
    </div>
  );
};

export default wrongChapters;
