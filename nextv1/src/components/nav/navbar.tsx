
import Account from './account'
import  Container  from '../container'
import Logo from './logo'
import Menu from './mainMenu'
import MobileMenu from './mobileMenu'


function Navbar() {
 
  return (
    <header className='bg-white py-5'> 
     <Container className='max-w-full text-light-black flex items-center justify-between px-8 border-b border-b-black/20'>
        {/* logo */}
        <div className='w-auto flex md:w-1/3 items-center gap-3 md:gap-0 justify-start'>
          <MobileMenu/>
          <Logo/>
        </div>
        {/* main menu */}
        <Menu/>
        {/* account */}
       <Account/>
     </Container>
     
    </header>
  )
}

export default Navbar
