import Searchbar from './searchbar'
import Cart from './cart'
import Fav from './favBtn'
import SignIn from './signin'

function Account() {
  return (
     <div className='w-auto md:w-1/3 flex gap-4 items-center justify-end'>
          <Searchbar/> 
          <Cart/>
          <Fav/> 
          <SignIn/>
        </div>
  )
}

export default Account
