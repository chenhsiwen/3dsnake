import { Router } from 'express';
import  firebase from 'firebase';

const rankRouter = new Router();
rankRouter.get('/', (req, res) => {
	let ranksRef = firebase.database().ref("ranks");
	ranksRef.orderByChild("score").limitToFirst(10).once('value').then((snapshot) =>{
 		console.log(snapshot.val());
 		// res.send(JSON.stringify(snapshot.val()));
	});
});
rankRouter.get('/:id', (req, res) => {
	let publicScore = {};
	let privateScore = {};
	let ranksRef = firebase.database().ref("ranks");
	ranksRef.orderByChild("score").limitToFirst(5).once('value').then((snapshot) =>{
 		publicScore = snapshot.val();
 		ranksRef.orderByChild("uid").equalTo(req.params.id).limitToFirst(5).once('value').then((snapshot) =>{
			privateScore = snapshot.val();
			console.log(publicScore);
			console.log(privateScore);
			res.send(JSON.stringify({publicScore:publicScore,privateScore:privateScore}));
		});
 		
	});
	
	

});



rankRouter.post('/', (req, res) => {
	let newrank = req.body;
	console.log(newrank);
	newrank.created_at = firebase.database.ServerValue.TIMESTAMP;
	let ranksRef = firebase.database().ref('ranks');
	   ranksRef.push().set(newrank)
		.catch(function(err){
		throw new Error('post fail');
 	})
});
export default rankRouter;