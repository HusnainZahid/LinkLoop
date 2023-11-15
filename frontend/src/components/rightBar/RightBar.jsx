import { useLocation } from "react-router-dom";
import "./rightBar.scss";
import SPONSER from '../../assets/altacademy.jpeg';

const RightBar = () => {
  const { pathname } = useLocation();


  return (
    <div className="rightBar">
      <div className="container">
        <div className="item">
          <span>Sponsored</span>
          <div className="user">
            <div className="userInfo">
              <img
                src={SPONSER}
                alt=""
                style={{width:pathname.substring(0,8) !== '/profile'?'280px':'370px'}}
              />
              <span>Top Coding Bootcamp</span>
              <p>altcademy.com</p>                
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RightBar;
