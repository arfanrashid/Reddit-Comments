import React, { Component } from 'react';
import {
  withRouter,
  Link,
} from 'react-router-dom';
import {
  Button,
  Col,
  Form,
  FormFeedback,
  FormGroup,
  Input,
  Label,
} from 'reactstrap';

class Create extends Component 
{
  constructor(props) 
  {
    super(props);
    this.state = {
      loading: false,
      title: '',
      contents: '',
      error: null,
      errors: {},
      comments:[],
      upvotes:0,
      downvotes:0
    };
  }

  updateTitle(ev) 
  {
    if(this.state.loading) return;
    this.setState({
      title: ev.target.value,
    });
  }
  updateContents(ev) 
  {
    if(this.state.loading) return;
    this.setState({
      contents: ev.target.value,
    });
  }
   
  submit() 
  {
    this.setState({
      loading: true,
    }, async () => {
      let result = await fetch('/api/topics/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: this.state.title,
          contents: this.state.contents,
          comments:this.state.comments,
          upvotes:this.state.upvotes,
          downvotes:this.state.downvotes
        }),
      });
      if(result.status !== 200) {
        this.setState({
          loading: false,
          error: await result.text(),
        });
        return;
      }
      let json = await result.json();
      if(json.success) {
        this.props.history.push('/');
      } else {
        this.setState({
          loading: false,
          errors: json.errors,
        });
      }
    });
  }


  //Render event.
  render() {
    console.log(this.state);
    if(this.state.error) {
      return <div>{this.state.error.toString()}</div>;
    }
    if(this.state.loading) {
      return <div>Loading</div>;
    }
    return (
      <Form>
        <FormGroup row>
          <Label for="title" sm={2}>Title</Label>
          <Col sm={10}>
            <Input
              type="text"
              name="title"
              id="title"
              placeholder="Title"
              sm={10}
              onChange={e => this.updateTitle(e)}
              value={this.state.title}
              disabled={this.state.loading}
              invalid={this.state.errors.title} />
            {
              this.state.errors.title ?
                <FormFeedback>{this.state.errors.title.message}</FormFeedback>
              : ''}
          </Col>
        </FormGroup>
        <FormGroup row>
          <Label for="contents" sm={2}>Contents</Label>
          <Col sm={10}>
            <Input
              type="textarea"
              name="contents"
              id="contents"
              placeholder="Contents"
              sm={10}
              onChange={e => this.updateContents(e)}
              value={this.state.contents}
              disabled={this.state.loading}
              invalid={this.state.errors.contents} rows="5" />
            {
              this.state.errors.contents ?
                <FormFeedback>{this.state.errors.title.message}</FormFeedback>
              : ''}
          </Col>
        </FormGroup>
        <FormGroup row>
        <Col sm={2}>  &nbsp; </Col>
          <Col sm={10}>
            <Button className="button" onClick={() => this.submit()}  disabled={this.state.loading}>Save</Button> &nbsp;
            <Button className="button" tag={Link} to='/' disabled={this.state.loading}>Cancel</Button>
          </Col>
        </FormGroup>
      </Form>
    );
  }
}

export default withRouter(Create);
