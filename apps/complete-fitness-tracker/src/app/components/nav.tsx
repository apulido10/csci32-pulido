import Image from 'next/image'
export default function nav() {
  return (
    <div>
      <div className='flex justify-between p-4 bg-zinc-100 items-center'>
      <Image src="/completefitnesstracker.png" alt="Fitness tracker" height={50}  width={290}></Image>
      <div className='flex '>
      <ul className='flex gap-5 text-xl font-bold '>
        <li className='cursor-pointer transition-all duration-300 ease-in-out hover:scale-110'>Home</li>
        <li className='cursor-pointer transition-all duration-300 ease-in-out hover:scale-110'>About</li>
        <li className='cursor-pointer transition-all duration-300 ease-in-out hover:scale-110'>Contact</li>
        <li className='cursor-pointer transition-all duration-300 ease-in-out hover:scale-110'>Log in</li>
      </ul>
      </div>
      </div>
    </div>
  )
}
