import '../css/Dashboard.css'
import location from '../assets/location.png'
import logo from '../assets/logo.png'
import {useState,useEffect} from 'react';
function Dashboard(){
    const [width, setWidth] = useState(window.innerWidth);
    const [open,setOpen] = useState(false)

useEffect(() => {
  const handleResize = () => setWidth(window.innerWidth);
  window.addEventListener('resize', handleResize);
  return () => window.removeEventListener('resize', handleResize);
}, []);
    return (<>
    <div className='container'>
    <div className='layout'>
         <div className={`side-bar ${open ? 'open' : ''}`}>
            {width<800?'':
            <div className='logo'>
            <h2>CampusConnect</h2>
            </div>}
            <div className='options'>
            <ul>
                <li><button>DashBoard</button></li>
                <li><button>Events</button></li>
                <li><button>Volunteer</button></li>
                <li><button>Notices</button></li>
                <li><button>Settings</button></li>
            </ul>
            </div>
            <div className='college-info'>
                <img src={location} alt='location'></img>
                <p>CVR COLLEGE OF ENGINEERING</p>
            </div>
        </div>
        <div className="header">
        <div className="header-left">
        {width<800?<button className="menu-btn" onClick={()=>setOpen(!open)}>☰</button>:  <ul>
                <li><button>Events</button></li>
                <li><button>Notices</button></li>
                <li><button>Support</button></li>
            </ul>}
        </div>
        <div className="header-center">
            <h2>CampusConnect</h2>
        </div>
        <div className="header-right">
             <ul>
                <li><button>About us</button></li>
                <li><button>Calendar</button></li>
                <li><button>Sign Up</button></li>
            </ul>
        </div>
        </div>
        <div className="main">
            <div className='welcome-msg'>
            <h3>Welcome, User!</h3>
            <p>Here's the overview of latest events!!</p>
            </div>
            <div className='summary'>
                <div className='s1'>
                    <p>Total Events</p>
                    <p>20</p>
                    <p>1 this week</p>
                </div>
                <div className='s2'>
                    <p>Total Events</p>
                    <p>20</p>
                    <p>1 this week</p>
                </div>
                <div className='s3'>
                    <p>Total Events</p>
                    <p>20</p>
                    <p>1 this week</p>
                </div>
                <div className='s4'>
                    <p>Total Events</p>
                    <p>20</p>
                    <p>1 this week</p>
                </div>
                 <div className='s5'>
                </div>
            </div>
            <div className='upcoming'>
                <div id='title'>Upcomign Events</div>
                     <div className='e1'>
                    <div><img src={logo} alt="CampusConnect logo" /></div>
                    <div>
                    <p>Hackathon 2025</p>
                    <p>Mon,Febuary 23 | Auditorium</p>
                    <p>120/189 Registered</p>
                    </div>
                    </div>
                     <div className='e2'>
                    <div><img src={logo} alt="CampusConnect logo" /></div>
                    <div>
                    <p>Hackathon 2025</p>
                    <p>Mon,Febuary 23 | Auditorium</p>
                    <p>120/189 Registered</p>
                    </div>
                    </div>
            </div>

                <div className='notices'>
                <div id='title'>Notices</div>
                     <div className='n1'>
                    <div><img src={logo} alt="CampusConnect logo" /></div>
                    <div>
                    <p>Holiday on upcoming saturday!</p>
                    <p>Due to scholarship strike college will remain closed...</p>
                    </div>
                    </div>
                     <div className='n2'>
                    <div><img src={logo} alt="CampusConnect logo" /></div>
                    <div>
                    <p>3rd saturday is compensated with friday timetable</p>
                    <p>day is followed by friday time table....</p>
                    </div>
                    </div>
                    <div className='n3'>
                    <div><img src={logo} alt="CampusConnect logo" /></div>
                    <div>
                    <p>3rd saturday is compensated with friday timetable</p>
                    <p>day is followed by friday time table....</p>
                    </div>
                    </div>
            </div>
        </div>
    </div>
    </div>
    </>)
}
export default Dashboard;