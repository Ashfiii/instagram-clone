import React, {useState, useEffect} from 'react';
import { Avatar } from '@material-ui/core';
import './Post.css';
import { db } from './firebase';
import firebase from 'firebase';

function Post({username,user, postId, caption, imageUrl}) {

    const [comments, setComments] = useState([])
    const [comment, setComment] = useState('');

    useEffect(()=>{
        const unsubscribe = db.collection('posts').doc(postId).collection('comments')
        .orderBy('timestamp', 'desc')
        .onSnapshot(snapshot=>{
            setComments(snapshot.docs.map(doc=> doc.data()))
            })
        return ()=>{
            unsubscribe();
          }
    },[postId])

    const addComment = (event)=>{
        event.preventDefault();
        db.collection('posts').doc(postId).collection('comments').add({
            text: comment,
            username: user.displayName,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        })
        setComment('');
    }

    return (
        <div className="post">
            <div className="post__header">
                <Avatar alt="Ashfaque" 
                src="/broken-image.jpg" 
                className="post__avatar" />
                <h3 className="post__username">{username}</h3>
            </div>
            <img src={imageUrl} className="post__image" alt="post"/>
            <h4 className="post__text"><strong>{username}</strong> {caption}</h4>
            <div className="post__comment">
                {comments.map( comment=>(
                    <p>{comment.username}: {comment.text}</p>
                ))}
            </div>
            {user ? <form className="post__commentBox">
                <input className="post__Input" type="text" placeholder="Write a comment..." value={comment} onChange={event=>{setComment(event.target.value)}} />
                <button className="post__Button" type="submit" disabled={!comment} onClick={addComment}>Post</button>
            </form>: ''}
            
        </div>
    )
}

export default Post
