import "./navbar.scss";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import WbSunnyOutlinedIcon from "@mui/icons-material/WbSunnyOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import LogoutIcon from '@mui/icons-material/Logout';
import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { DarkModeContext } from "../../context/darkModeContext";
import { AuthContext } from "../../context/authContext";
import { QueryClient, useMutation } from "@tanstack/react-query";
import { makeRequest } from "../../axios";

const Navbar = () => {
  const { toggle, darkMode } = useContext(DarkModeContext);
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate()

  const handleSubmit = (event) => {
    if (event.key === 'Enter') {
      console.log('do validate')
    }
  }

  const mutation = useMutation(
    (newPost) => {
      return makeRequest.post("/auth/logout");
    },
    {
      onSuccess: (res) => {
      },
    }
  );

  const logout = async (e) => {
    mutation.mutate();
    navigate("/login")
  };

  return (
    <div className="navbar">
      <div className="left">
        <Link to="/" style={{ textDecoration: "none" }}>
          <span>Linkloop</span>
        </Link>
        {/* <div className="search">
          <SearchOutlinedIcon />
          <input type="text" placeholder="Search..." onKeyDown={handleSubmit}/>
        </div> */}
      </div>
      <div className="right">
        {darkMode ? (
          <WbSunnyOutlinedIcon onClick={toggle} />
        ) : (
          <DarkModeOutlinedIcon onClick={toggle} />
        )}
        <Link to={`/profile/${currentUser.id}`} className="user">
          <span>{currentUser.username}</span>
          <img
            src={currentUser.profilePic ? currentUser.profilePic:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTaJHZ3NwZ6Jd02Oom2HyKlOgn7j1v-AYvSRGiq9Z_Wo9U_N4p4mijzT9SvWcXtLbHn-qM&usqp=CAU"}
            alt=""
          />
        </Link>
        <LogoutIcon onClick={logout}/>
      </div>
    </div>
  );
};

export default Navbar;
