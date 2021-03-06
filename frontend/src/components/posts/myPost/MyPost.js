import React, { useContext, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../../shared/context/auth-context";
import { useHttpClient } from "../../shared/hooks/http-hook";
import Masthead from "../../shared/masthead/Masthead";
import PostHeading from "../shared/postHeading/PostHeading";
import imageUrl from "../../../assets/images/home-bg.jpg";
import PostLayout from "../shared/postLayout/PostLayout";
import Loading from "../../shared/loading/Loading";
import Error from "../../shared/error/Error";

const MyPost = (props) => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const userId = useParams().userId;
  const [loadedPosts, setLoadedPosts] = useState();
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/posts/myposts/${userId}`,
          "GET",
          undefined,
          { Authorization: "Bearer " + auth.token }
        );
        setLoadedPosts(responseData.userPosts);
      } catch (err) {}
    };
    fetchPosts();
  }, [sendRequest, userId, auth.token]);

  // when no posts exist in returned array
  let noPostLoaded;
  if (loadedPosts) {
    if (loadedPosts.length === 0) {
      noPostLoaded = true;
    }
  }
  //Handler for deleting Posts
  const postDeletedHandler = (deletedPostId) => {
    setLoadedPosts((prevPosts) =>
      prevPosts.filter((post) => post.id !== deletedPostId)
    );
  };
  return (
    <React.Fragment>
      <Masthead mypost url={imageUrl} authName={auth.name} />
      <PostLayout>
        {/* Error Handling */}
        {error && <Error click={clearError} error={error} />}

        {/* Loading State  */}
        <div className=" text-center ">{isLoading && <Loading />}</div>

        {/* No loading but post are loaded  */}
        {!isLoading && loadedPosts && (
          <div>
            {loadedPosts.map((post) => (
              <PostHeading
                key={post.id}
                id={post.id}
                title={post.title}
                username={post.username}
                createdAt={post.time}
                description={post.description}
                edit={true}
                onDelete={postDeletedHandler}
              />
            ))}
          </div>
        )}
        {/* No Loading and No post loaded */}
        {!isLoading && noPostLoaded && (
          <div className="post-preview text-center">
            <h2 className="post-title ">No post to show</h2>
          </div>
        )}
      </PostLayout>
    </React.Fragment>
  );
};

export default MyPost;
