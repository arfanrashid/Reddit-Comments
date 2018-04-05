import React, { Component } from 'react';
import * as FontAwesome from 'react-icons/lib/fa';
import io from 'socket.io-client';


import {
  Col,
  Form,
  FormGroup,
  Input,
  Button
} from 'reactstrap';
import { Link } from 'react-router-dom';
var host= "https://topics-comments-node.herokuapp.com:3001";//location.origin;
console.log(host);
//const socket =  io.connect(host,{secure:true});
const socket =  io.connect(host,{secure:true});
class Single extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      error: null,
      title: '',
      contents: '',
      comments: [],
      upvotes:0,
      downvotes:0,
      errors: {},
      created:Date.Now
    };
    

    socket.on('TopicUpdated', (data) => {
      console.log('TopicUpdated: '+JSON.stringify(data));
     
      this.setState(
        {
         upvotes:data.upvotes,
         downvotes:data.downvotes
        });
      
    });

  }
 

  async fetch(id) 
  {
    if(!id) {
      id = this.props.match.params.topicId;
    }
    try {
      await new Promise(res => this.setState({
        loading: true,
      }, res));
      let result = await fetch(`/api/topics/${id}/`);
      
      if(result.status !== 200) {
        this.setState({
          loading: false,
          error: await result.text(),
        });
        return;
      }

      let json = await result.json();
      console.log(json);
      this.setState(
        {
        loading: false,
        error: null,
        id: json.topic._id,
        title: json.topic.title,
        comments:json.topic.comments,
        upvotes: json.topic.upvotes,
        downvotes: json.topic.downvotes,
        contents: json.topic.contents,
        created:  new Date(json.topic.created)
      });
    } catch(e) {
      this.setState({
        loading: false,
        error: e,
      });
    }
  }
save()
{
  this.setState({
    loading: true,
  }, async () => {
    let result = await fetch(`/api/topics/${this.state.id}/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: this.state.title,
        comments:this.state.comments,
        upvotes:this.state.upvotes,
        downvotes:this.state.downvotes,
        contents:this.state.contents,
      }) ,
      socket: socket
    });

    if(result.status !== 200) {
      this.setState({
        loading: false,
        error: await result.text(),
      });
      return;
    }
    let json = await result.json();
    if(json.success) 
    {
      this.setState({
        loading: false,
        error: false,
      });
    } else {
      this.setState({
        loading: false,
        errors: json.errors,
      });
    }
  });
}
  submit() 
  {
    this.updateComments();
    this.save();
  }

  updateComments(){
this.setState({

  comments:this.state.comments.concat(document.getElementById("Comments").value)
});
    }


  updateUpVotes()
  {
    this.setState({
      upvotes:(this.state.upvotes +1)
    });

    this.save();
  }
  
  updateDownVotes()
  {
    this.setState({
      downvotes:(this.state.downvotes+1)
     });
    this.save();
  }
  componentWillMount() {
    this.fetch();
  }

  componentWillReceiveProps(newProps) {
    if(this.props.match.params.topicId !== newProps.match.params.topicId)
    {
      this.fetch(newProps.match.params.topicId);
    }
  }

  render() {

    if(this.state.loading)
     {
      return <div>Loading ....</div>;
    }
    if(this.state.error) {
      return <div>{this.state.error.toString()}</div>;
    }
    console.log(this.state);
    return (
      
      <Col sm={10}>
      <Form>
        <FormGroup row>
        <Col sm={1}>
           <a onClick={()=>this.updateUpVotes()}><FontAwesome.FaArrowUp /></a>
           <div> &nbsp;{this.state.upvotes-this.state.downvotes}</div>
           <a onClick={()=>this.updateDownVotes()}><FontAwesome.FaArrowDown /></a>
        </Col>
        <Col sm={1}> <FontAwesome.FaCommentO className="fa-xl" /> </Col>
          <Col sm={10}>
           <h2 className="comment-title">{this.state.title} <span className="user-name">Arfan.Rashid</span></h2>
           <p className="post-time">Submitted {  Math.round(( Math.abs((new Date()).getTime() - this.state.created.getTime() )/(1000*3600)) * 100) / 100} Hours ago by <span className="post-user">ruchitrami17</span></p>
           <hr />
           <p className="post-content">{this.state.contents}</p>
           <p className="comment-line"><span className="comment-link">{this.state.comments.length} comments</span> share save hide give gold report crosspost</p>
          </Col>
        </FormGroup>
        <FormGroup row>
        <Col sm={2}>
          </Col>
          <Col sm={10}>
        <ul>
        {
          this.state.comments.map( (comment,index )=> <li key={index}>
                 {comment}
                 </li>)
                }
        </ul>

       </Col>
        </FormGroup>
        <FormGroup row>
        <Col sm={2}>
        </Col>
          <Col sm={10}>
            <Input
              type="textarea"
              name="Comments"
              id="Comments"
              placeholder="Topic Comments"
              disabled={this.state.loading} 
              rows="8"
              />
          </Col>
          <Col sm={2}>
        </Col>
          <Col sm={3}>
          <br />
          <Button  className="button" onClick={() => this.submit()} disabled={this.state.loading} >Save</Button> &nbsp;
          <Button className="button" tag={Link} to='/' disabled={this.state.loading}>Back</Button>
          </Col>
          <Col sm={7}>
          <p className="comment-line bottom-line"><span className="comment-link">content policy</span> formatting help</p>
          </Col>
        </FormGroup>
        
      </Form>
      </Col>
    );
  }
}

export default Single;
