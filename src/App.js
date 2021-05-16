import React, {useEffect, useState} from 'react';
import './App.css';
import img from './image/Instagram_logo.png';
import Post from './components/Post/Post';
import {db, auth} from './firebase';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { Button, Input } from '@material-ui/core';
import ImageUpload from './components/ImageUpload/ImageUpload';
import InstagramEmbed from 'react-instagram-embed';

const url='https://www.instagram.com/p/CEl4u9UgWlV/';

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 250,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const classes= useStyles();
  
  const [modalStyle] = useState(getModalStyle);
  const [posts, setPosts] = useState([])
  const [openSignUp, setOpenSignUp] = useState(false)
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [openSignIn, setOpenSignIn] = useState(false)

  useEffect(()=>{
    const unsubscribe = auth.onAuthStateChanged(authUser =>{
      if(authUser){
        console.log(authUser);
        setUser(authUser);
      }else{
        setUser(null)
      }
    })
    return ()=>{
      unsubscribe();
    }
  },[user, username])

  useEffect(()=>{
    db.collection('posts')
    .orderBy('timestamp', 'desc')
    .onSnapshot(snapshot =>{
      setPosts(snapshot.docs.map(doc => ({id: doc.id, post:doc.data()})))
    })
  },[])

  const handleSignUp =(event)=>{
    event.preventDefault();
    auth.createUserWithEmailAndPassword(email, password)
    .then((authUser)=>{
      return authUser.user.updateProfile({
        displayName: username
      })
    })
    .catch(err => alert(err.message));
    setOpenSignUp(false)
    setUsername('');
    setEmail('');
    setPassword('');
  }

  const handleSignIn =(event)=>{
    event.preventDefault();
    auth.signInWithEmailAndPassword(email, password)
    .catch(err => alert(err.message));
    setOpenSignIn(false)
    setUsername('');
    setEmail('');
    setPassword('');
  }

  return (
    <div className="App">
      <Modal className="app__modal" open={openSignUp} onClose={()=>setOpenSignUp(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form className="app__form">
              <img src={img} className="app__headerImage" alt=""  width="150" height="50"/>
            <Input className="modal__input" type="text" placeholder="username" value={username} onChange={(event)=>setUsername(event.target.value)}/>
            <Input className="modal__input" type="text" placeholder="email" value={email} onChange={(event)=>setEmail(event.target.value)}/>
            <Input className="modal__input" type="text" placeholder="password" value={password} onChange={(event)=>setPassword(event.target.value)}/>
            <Button type="submit" onClick={handleSignUp}>Sign Up</Button>
          </form>
        </div>
      </Modal>
      <Modal className="app__modal" open={openSignIn} onClose={()=>setOpenSignIn(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form className="app__form">
            <center>
              <img src={img} className="app__headerImage" alt=""  width="150" height="50"/>
            </center>
            <Input className="modal__input" type="text" placeholder="email" value={email} onChange={(event)=>setEmail(event.target.value)}/>
            <Input className="modal__input" type="text" placeholder="password" value={password} onChange={(event)=>setPassword(event.target.value)}/>
            <Button type="submit" onClick={handleSignIn}>Sign In</Button>
          </form>
        </div>
      </Modal>
      
      <div className="app__header">
        <img className="app_headerImage" src ={img} alt="instagram-logo" width="120" height="40"/>
        {user ? (<Button className="app__logout" onClick={()=>auth.signOut()}>Logout</Button>): 
        (<div className="app__logInContainer">
        <Button className="app__signUp" onClick={()=>setOpenSignUp(true)}>Sign Up</Button>
        <Button className="app__signIn" onClick={()=>setOpenSignIn(true)}>Sign In</Button>
        </div>
      )}
      </div>
      {user ? 
      <ImageUpload className="app__imageUpload" username={user.displayName}/> : <div><p>Sign In to upload post</p></div>}
      <div className="app__posts">
        <div className="app__postLeft">
          {posts.map(({id, post}) =>(
            <Post key={id} postId={id} user={user} username={post.username} caption={post.caption} imageUrl={post.imageUrl}/>
          ))}
        </div>
        <div className="app__postRight">
          <InstagramEmbed
            url={url}
            maxWidth={320}
            hideCaption={false}
            containerTagName='div'
            protocol=''
            injectScript
            onLoading={() => {}}
            onSuccess={() => {}}
            onAfterRender={() => {}}
            onFailure={() => {}}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
