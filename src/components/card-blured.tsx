import Image from 'next/image'
import React from 'react'

import clock from '@/../public/clock.svg'

interface CardProps {
  percentage?: string
  imageSrc: string
  imageAlt: string
  title: string
  description: string
  timeRemaining?: string
  yesButtonText?: string
  noButtonText?: string
  onYesClick?: () => void
  onNoClick?: () => void
}

function Cardblur({ 
    percentage = "67%", 
    title, 
    description,
    timeRemaining = "23d 21h Remaining",
    yesButtonText = "Yes\n1 SOL → 1.49 SOL",
    noButtonText = "No\n1 SOL → 3.03 SOL",
    onYesClick,
    onNoClick
  }: CardProps) {
  const percentValue = parseFloat(percentage.replace('%', ''))
  

  const angle = 180 - (percentValue / 100) * 180
  const radians = (angle * Math.PI) / 180
  
  const gapDegrees = 6
  const gapRadians = (gapDegrees * Math.PI) / 180
  
  const cx = 29.5
  const cy = 29.5
  const radius = 27.5
  
  const yellowEndX = cx + radius * Math.cos(radians + gapRadians)
  const yellowEndY = cy - radius * Math.sin(radians + gapRadians)
  
  const redStartX = cx + radius * Math.cos(radians - gapRadians)
  const redStartY = cy - radius * Math.sin(radians - gapRadians)
  
  const redPercentage = 100 - percentValue
  
  return (
    <div className='flex-1 flex flex-col bg-[#DD8D15]/6 backdrop-blur-xl rounded-[8px] relative'>
      <div style={{ filter: 'blur(3px)' }} className='w-full h-full border border-[#DD8D15]/20 rounded-[8px]'>
        <div className='flex items-center pl-6 pt-6 pr-[35px] pb-6'>
          <div>
            <div className="w-[30px] h-[30px] bg-[#818181] rounded-full"></div>
          </div>
          <div className='flex flex-col font-pp-neue font-medium text-[12px] ml-4 justify-between'>
            <span className='text-white'>{title}</span>
            <span className=' text-white/70'>{description}</span>
          </div>
          <div className='ml-auto font-medium font-pp-neue'>
            <svg width="59" height="34" viewBox="0 0 59 34" fill="none" xmlns="http://www.w3.org/2000/svg">
              <text x="29.5" y="26" textAnchor="middle" dominantBaseline="middle" fill="white" fontSize="16" fontFamily="inherit" fontWeight="500">
                {percentage}
              </text>
              <path 
                d={`M 2 29.5 A 27.5 27.5 0 0 1 ${yellowEndX} ${yellowEndY}`}
                stroke="#818181" 
                strokeWidth="4"
                fill="none"
                strokeLinecap="round"
              />
              <path 
                d={`M ${redStartX} ${redStartY} A 27.5 27.5 0 0 1 57 29.5`}
                stroke="#818181" 
                strokeWidth="4"
                fill="none"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>
      <div className='px-6 pb-4'>
        <div className='flex gap-4'>
          <button 
            onClick={onYesClick}
            className='flex-1 bg-[#818181] hover:bg-[#818181]/90 transition-colors rounded-lg h-[54px] px-4 flex flex-col items-center justify-center'
          >
            <span className='text-white font-inter font-semibold text-[14px]'>
              {yesButtonText.split('\n')[0]}
            </span>
            <span className='text-white/50 font-inter text-[10px] mt-1'>
              {yesButtonText.split('\n')[1]}
            </span>
          </button>
          
          <button 
            onClick={onNoClick}
            className='flex-1 bg-[#818181] hover:bg-[#818181]/90 transition-colors rounded-lg h-[54px] px-4 flex flex-col items-center justify-center'
          >
            <span className='text-white font-inter font-semibold text-[14px]'>
            {noButtonText.split('\n')[0]}
            </span>
            <span className='text-white/50 font-inter text-[10px] mt-1'>
              {noButtonText.split('\n')[1]}
            </span>
          </button>
        </div>
        
        <div className='mt-3 gap-1 bg-white/9 rounded-[4px] flex items-center h-[23px] px-4  justify-center'>
          <Image src={clock} alt='clock' height={16} width={16}/>
          <span className='text-white font-pp-neue text-[10px]'>{timeRemaining}</span>
        </div>
      </div>
        
        <div className='mt-6 relative font-pp-neue px-2 pb-2'>
          <div className='flex mb-2 relative'>
            <div 
              className='flex items-center justify-center gap-2'
              style={{ width: `${percentValue}%` }}
            >
              <span className='text-[#818181] font-pp-neue font-medium text-[10px]'>{percentage}</span>
              <span className='text-white/70 font-pp-neue text-[10px]'>Chance</span>
            </div>
            <div 
              className='flex items-center justify-center gap-2'
              style={{ width: `${redPercentage}%` }}
            >
              <span className='text-[#818181] font-pp-neue font-medium text-[10px]'>{redPercentage}%</span>
              <span className='text-white/70 font-pp-neue text-[10px]'>Chance</span>
            </div>
          </div>
          <div className='w-full h-[6px] rounded-full overflow-hidden flex gap-1'>
            <div 
              className='h-full bg-[#818181] rounded-full transition-all duration-300'
              style={{ width: `${percentValue}%` }}
            />
            <div 
              className='h-full bg-[#818181] rounded-full transition-all duration-300'
              style={{ width: `${redPercentage}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cardblur