import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {
  Button,
  Col,
  FormGroup
} from 'reactstrap';

import './List.css';

class List extends Component {  constructor(props) {
    super(props);
    this.state = {
      data: null,
      loading: false,
      error: null,
    };
  }
sort(ev){
var list= this.state.data.topics;
if(ev.target.value==='date')
this.setState({
  data:{topics: this.sortByKey(list, 'created')}
});

else
this.setState({
  data:{topics: this.sortByKey(list, 'upvotes')}
});

}

 sortByKey(array, key) 
 {
  return array.sort(function(a, b) {
      var x = a[key]; var y = b[key];
      return ((x < y) ? 1 : ((x > y) ? -1 : 0));
  });
}


  async fetch() {
    try {
      await new Promise(res => this.setState({
        loading: true,
      }, res));
      let result = await fetch(`/api/topics/` , {
        headers : { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
         }
  
      }
);
      if(result.status !== 200) {
        this.setState({
          loading: false,
          error: await result.text(),
        });
        return;
      }
      let json = await result.json();
     
      this.setState({
        loading: false,
        error: null,
        data: json
      });
      
    } catch(e) {
      this.setState({
        loading: false,
        error: e,
      });
    }
  }
  componentWillMount() {
    this.fetch();
  }

   
  render() {
    if(this.state.error) {
      return <div>{this.state.error.toString()}</div>;
    }
    if(this.state.loading) {
      return <div>Loading</div>;
    }
    return (
      <React.Fragment>
         <FormGroup row>
        <Col sm={8}>
     <label className="bold">Sort By</label> <select onChange={e => this.sort(e)}><option value="upvotes">Most Votes</option><option value="date" >Latest</option></select>
        </Col>
        <Col sm={4}>
        <Button className="button" tag={Link} to='/topics/create'>Create a new Topic</Button> 
        </Col>
        </FormGroup>
        <br />
<ul className="TopicsList">
  {
            this.state.data.topics.map(topic =>
             <li key={topic._id}>
           
              <Link to={`/topics/${topic._id}/`}>
                <h4>{topic.title}</h4>
              </Link>  
               <div>{new Date(topic.created).toLocaleDateString()}</div>
            </li>
          )}
        </ul>
      </React.Fragment>
    );
  }
}

export default List;
