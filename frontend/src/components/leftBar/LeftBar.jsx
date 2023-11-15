import "./leftBar.scss";
import { AuthContext } from "../../context/authContext";
import { useContext, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import { Link, useLocation } from "react-router-dom";

const LeftBar = () => {

  const { currentUser } = useContext(AuthContext);
  const { pathname } = useLocation();

  useEffect(() => {console.log(pathname.substring(0,8))},[pathname])

  const { isLoading, error, data } = useQuery(["users"], () =>
    makeRequest.get("/users/").then((res) => {
      return res.data;
    })
  );

  return (
    <>
    {pathname.substring(0,8) !== '/profile' ? (
    <div className="leftBar">
      <div className="container">
        <div className="menu">
          <span>Suggestions For You</span>
          {data?.map((item,i) => {
            if(item.id !== currentUser.id){
            return(
              <Link to={`/profile/${item.id}`} key={i} className="item">
                {item?.profilePic ? (
                <img src={item.profilePic} alt="" className="profilePic" />
                ):<img src={"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTaJHZ3NwZ6Jd02Oom2HyKlOgn7j1v-AYvSRGiq9Z_Wo9U_N4p4mijzT9SvWcXtLbHn-qM&usqp=CAU"} alt="" className="profilePic" />}
                <span>{item?.username}</span>
              </Link>  
            )
          }
          })}
        </div>
      </div>
    </div>
    ):null}
    </>
  );
};

export default LeftBar;
