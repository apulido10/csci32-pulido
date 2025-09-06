import Image from 'next/image'
// I created a component for my nav bar
import Nav from './components/nav'
export default function Home() {
  return <div>
    <Nav/>
    <h1 className='text-center text-2xl font-bold m-10'>Meals, workouts, progress — simplified in one tracker</h1>
  </div>
}
