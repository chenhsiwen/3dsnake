import { Router } from 'express';
import  firebase from 'firebase';

const userRouter = new Router();
let uid = '';

userRouter.post('/signup', (req, res) => {
	firebase.auth().createUserWithEmailAndPassword(req.body.account, req.body.password)
  .then(()=>{
    uid = firebase.auth().currentUser.uid;
    let loginUserRef = firebase.database().ref('users/' + uid);
    loginUserRef.set({
      username : req.body.username,
      uid : uid,
      account : req.body.account,
      created_at : firebase.database.ServerValue.TIMESTAMP
    }).catch((error) =>{
      res.send(JSON.stringify("error"));
    });
    loginUserRef.once('value').then((snapshot) =>{
      res.send(JSON.stringify(snapshot.val()));
      }).catch((error) =>{
        res.send(JSON.stringify("error"));
      });;
    })
  .catch((error) =>{
    res.send(JSON.stringify("error"));
  });
});


userRouter.post('/login', (req, res) => {
	firebase.auth().signInWithEmailAndPassword(req.body.account, req.body.password)
	.then(() => {
  	uid = firebase.auth().currentUser.uid;
    let loginUserRef = firebase.database().ref('users/' + uid);
    loginUserRef.once('value').then((snapshot) =>{
      res.send(JSON.stringify(snapshot.val()));
    }).catch((error) =>{
      res.send(JSON.stringify("error"));
    });;
	})
	.catch((error) => {
    res.send(JSON.stringify("error"));
	});
})



userRouter.post('/logout', (req, res) => {
  
	if (req.body.logout === true){

	  	firebase.auth().signOut().then(() => {
    	res.send(JSON.stringify("logout"));
  	})
  	.catch((error) => {
  		res.send(JSON.stringify("error"));
  	});
  }
})


export default userRouter;