import React, {useState} from 'react';
import {db, storage} from '../../firebase';
import firebase from 'firebase';
import './ImageUpload.css';

function ImageUpload({username}) {

    const [caption, setCaption] = useState('')
    const [image, setImage] = useState(null)
    const [progress, setProgress] = useState('');

    const handleChange = (event)=>{
        if(event.target.files[0]){
            setImage(event.target.files[0])
        }
    }

    const handleUpload = ()=>{
        console.log(image.name);
        const uploadTask = storage.ref(`images/${image.name}`).put(image);
        uploadTask.on(
            "state_changed",
            (snapshot) =>{
                const progress = Math.round((snapshot.bytesTransferred/snapshot.totalBytes) *100);
                setProgress(progress)
            },
            (error) =>{
                console.log(error);
                alert(error.message);
            },
            ()=>{
                storage
                .ref('images')
                .child(image.name)
                .getDownloadURL()
                .then(url=>{
                    db.collection("posts").add({
                        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                        caption: caption,
                        imageUrl: url,
                        username: username
                    })
                   setProgress(0);
                   setCaption('');
                   setImage(null);
                })
            }
            
        )
    }
    return (
        <div className="imageUpload">
            <progress className="imageUpload__progress" value={progress} max="100"/>
            <input className="imageUpload__textInput" type="text" placeholder="Write a caption..." value={caption} onChange={event=>{setCaption(event.target.value)}}/>
            <input className="imageUpload__file" type="file" onChange={handleChange}/>
            <button className="imageUpload__button" onClick={handleUpload}>Upload</button> 
        </div>
    )
}

export default ImageUpload
