//import ContentLoader from "react-content-loader"
import '../App.css'

const Loader: React.FC = () => {
  return (
//     <div className={'h-12 flex mt-12 justify-center items-center align-middle'}>
//     <svg xmlns="http://www.w3.org/2000/svg" className={"background: none; shape-rendering: auto;"} width="200px" height="200px" viewBox="0 0 100 100">
// <circle cx="50" cy="50" fill="none" stroke="#3b82f6" stroke-width="10" r="35" stroke-dasharray="164.93361431346415 56.97787143782138">
//   <animateTransform attributeName="transform" type="rotate" repeatCount="indefinite" dur="1s" values="0 50 50;360 50 50" keyTimes="0;1"></animateTransform>
// </circle>
// </svg>
// </div>
/* <div className="">
<div
className="flex rounded-md"
>
<ContentLoader 
speed={2}
//width={1000}
//height={1000}
//viewBox="0 0 100% 100%"
backgroundColor="#e0e0e0"
foregroundColor="#f7f7f7"
>
<rect x="0" y="0" rx="2" ry="2" width="100%" height="100%" /> 
<rect x="0" y="780" rx="0" ry="0" width="100%" height="100%" />
</ContentLoader>
</div>
</div> */

/* <div className="gradient element2 rounded w-full">
</div> */

<div className="heart" style={{marginLeft: 'auto', marginRight: 'auto'}}>
    <img src={'elalogo.png'} alt="" />
  </div>


  )
}

export default Loader
