import "./profile.scss";
import PlaceIcon from "@mui/icons-material/Place";
import LanguageIcon from "@mui/icons-material/Language";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import Posts from "../../components/posts/Posts";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import { useLocation } from "react-router-dom";
import { useContext, useEffect } from "react";
import { AuthContext } from "../../context/authContext";
import Update from "../../components/update/Update";
import { useState } from "react";

const Profile = () => {
  const [openUpdate, setOpenUpdate] = useState(false);
  const { currentUser } = useContext(AuthContext);

  const userId = parseInt(useLocation().pathname.split("/")[2]);

  const { isLoading, error, data } = useQuery(["user"], () =>
    makeRequest.get("/users/find/" + userId).then((res) => {
      return res.data;
    })
  );

  const { isLoading: rIsLoading, data: relationshipData } = useQuery(
    ["relationship"],
    () =>
      makeRequest.get("/relationships?followedUserId=" + userId).then((res) => {
        return res.data;
      })
  );

  const queryClient = useQueryClient();

  const mutation = useMutation(
    (following) => {
      if (following)
        return makeRequest.delete("/relationships?userId=" + userId+"&user_id="+currentUser.id);
      return makeRequest.post("/relationships", { user_id:currentUser.id,userId });
    },
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries(["relationship"]);
      },
    }
  );

  const handleFollow = () => {
    mutation.mutate(relationshipData.includes(currentUser.id));
  };

  return (
    <div className="profile">
      {isLoading ? (
        "loading"
      ) : (
        <>
          <div className="images">
            {data?.coverPic ? (
            <img src={data.coverPic} alt="" className="cover" />
            ):<img src={"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQMr2EfFCHSb0LqAzCj7GAUutLW-JX-0ct_wx7qSDxROB_nCHvznj4rtJz4FdiQb19Kd-0&usqp=CAU"} alt="" className="cover" />}
            {data?.profilePic ? (
            <img src={data.profilePic} alt="" className="profilePic" />
            ):<img src={"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTaJHZ3NwZ6Jd02Oom2HyKlOgn7j1v-AYvSRGiq9Z_Wo9U_N4p4mijzT9SvWcXtLbHn-qM&usqp=CAU"} alt="" className="profilePic"/>}
          </div>
          <div className="profileContainer">
            <div className="uInfo">
              <div className="left">
              </div>
              <div className="center">
                <div className="info">
                  <span>{data.name}</span>
                  {data?.email ? (
                  <div className="item">
                    <EmailOutlinedIcon />
                    <span>{data.email}</span>
                  </div>
                  ):null}
                  {data.city ? (
                  <div className="item">
                    <PlaceIcon />
                    <span>{data.city}</span>
                  </div>
                  ):null}
                  {data.website ? (
                  <div className="item">
                    <LanguageIcon />
                    <span>{data.website}</span>
                  </div>
                  ):null}
                </div>
                {rIsLoading ? (
                  "loading"
                ) : userId === currentUser.id ? (
                  <button onClick={() => setOpenUpdate(true)}>Update</button>
                ) : (
                  <button onClick={handleFollow}>
                    {relationshipData.includes(currentUser.id)
                      ? "Following"
                      : "Follow"}
                  </button>
                )}
              </div>
              <div className="right">
                {/* <EmailOutlinedIcon />
                <MoreVertIcon /> */}
              </div>
            </div>
            <Posts userId={userId} />
          </div>
        </>
      )}
      {openUpdate && <Update setOpenUpdate={setOpenUpdate} user={data} />}
    </div>
  );
};

export default Profile;
