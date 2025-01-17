import DefaultAvatar from "../assets/defaultpic.jpg";

const Avatar = ({ src, alt = "Avatar", className= "" }) => {
  return (
    <img 
      src={src || DefaultAvatar} 
      alt={alt} 
      className={className}
    />
  );
};

export default Avatar;
