import {useEffect, useRef} from 'react'
import "../styles/Sky.css"

function Sky(){

    const skyRef=useRef(null)
    useEffect(()=>{
        const sky=skyRef.current
        const starCount=80

        for (let i =0;i<starCount;i++){
            const star=document.createElement("div")
            star.classList.add("star")
            const x = Math.random() * 100
            const y = Math.random() * 60
            const size = Math.random() * 2.5 + 1
            const delay = Math.random() * 4
            const duration = Math.random() * 2 + 2
      
            star.style.left = `${x}%`
            star.style.top = `${y}%`
            star.style.width = `${size}px`
            star.style.height = `${size}px`
            star.style.animationDelay = `${delay}s`
            star.style.animationDuration = `${duration}s`
            sky.appendChild(star)
      
        }
        return()=>{
            while(sky.firstChild){
                sky.removeChild(sky.firstChild)
            }
        }
    },[])
    return <div className='sky-layer' ref={skyRef}/>
}
export default Sky