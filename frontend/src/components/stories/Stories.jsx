import { useContext, useEffect, useState } from "react";
import "./stories.scss";
import { AuthContext } from "../../context/authContext";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import { useNavigate } from "react-router-dom";

const Stories = () => {
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);
  const [showstories,setshowstories] = useState(false);
  const [addstories,setaddstories] = useState(false);
  const [selectedStories,setselectedStories] = useState(null);
  const [image, setImage] = useState(null);

  const { isLoading, error, data } = useQuery(["stories"], () =>
    makeRequest.get("/stories").then((res) => {
      return res.data;
    })
  );

  useEffect(() => {
    if(error){
      console.log(error)
      // navigate('/login')
    }
  },[error])

  //TODO Add story using react-query mutations and use upload function.

  const onImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
        setImage(event.target.files[0]);
      }
    }

    const upload = async () => {
      try {
        const formData = new FormData();
        formData.append("file", image);
        const res = await makeRequest.post("/upload", formData);
        return res.data;
      } catch (err) {
        console.log(err);
      }
    };
    
    const queryClient = useQueryClient();
  
    const mutation = useMutation(
      (newPost) => {
        return makeRequest.post("/stories", newPost);
      },
      {
        onSuccess: () => {
          // Invalidate and refetch
          queryClient.invalidateQueries(["stories"]);
        },
      }
    );
  
    const handleClick = async (e) => {
      e.preventDefault();
      let imgUrl = "";
      if (image) imgUrl = await upload();
      let body = { img: imgUrl?.image, userId:currentUser.id };
      console.log(body);
      mutation.mutate(body);
      setaddstories(false);
    };
  
    const deleteMutation = useMutation(
      (storyId) => {
        return makeRequest.delete("/stories/" + storyId);
      },
      {
        onSuccess: () => {
          // Invalidate and refetch
          queryClient.invalidateQueries(["stories"]);
        },
      }
    );
  
    const handleDelete = () => {
      deleteMutation.mutate(selectedStories.id);
      setshowstories(false);
    };
    
  return (
    <div className="stories">
      <div className="story">
        <img src={currentUser.profilePic ? currentUser.profilePic:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTaJHZ3NwZ6Jd02Oom2HyKlOgn7j1v-AYvSRGiq9Z_Wo9U_N4p4mijzT9SvWcXtLbHn-qM&usqp=CAU"} alt="" />
        <span>{currentUser.name}</span>
        <button onClick={() => {setaddstories(true)}}>+</button>
      </div>
      {error
        ? "Something went wrong"
        : isLoading
        ? "loading"
        : data?.map((story) => (
            <div onClick={() => {
              setselectedStories(story);
              setshowstories(true)
            }} className="story" key={story.id}>
              <img src={story.img} alt="" />
              <span>{story.name}</span>
            </div>
          ))}
        {showstories === true ? (
          <div className="update">
            <div className="wrapper">
            <h1>{selectedStories.name}</h1>
            <img src={selectedStories.img} alt="" className="preview_image" style={{alignSelf:'center',borderRadius:'10px'}}/>
            <button className="close" onClick={() => {setshowstories(false)}}>
              X
            </button>
            {currentUser.id === selectedStories.userid ? (
            <button className="delete" onClick={handleDelete}>
              Delete
            </button>
            ):null}
            </div>
          </div>
        ):null}
        {addstories === true ? (
        <div className="update">
            <div className="wrapper">
            <div style={{marginTop:'40px'}}>
            <label for="files" class="file">Select Image</label>
            <input id="files" onChange={onImageChange} style={{visibility:"hidden"}} type="file"/>            
            </div>
            {image ? (
              <img className="select_image" alt="" src={URL.createObjectURL(image)}/>
            ):null}
            <div onClick={handleClick} class="submit">
                <p>Submit</p>
            </div>
            <button className="close" onClick={() => {setaddstories(false)}}>
              X
            </button>
            </div>
        </div>
        ):null}
    </div>
  );
};

export default Stories;
