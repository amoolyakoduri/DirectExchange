import React, {Component, Fragment} from 'react';
import {
    Card, CardText, CardBody, CardImg,
    CardTitle, CardSubtitle, Button
  } from 'reactstrap';
import './quiz-card.css';

class QuizCard extends Component {

    render() {
        var details = this.props.details;
        return (
            <Fragment>
                <Card className="quiz-card-container shadow">
                    <CardBody>
                        <CardTitle><h4>{details.name}</h4></CardTitle>
                        <CardText>Id:{details.id}</CardText>
                        <CardText>Duration:{details.duration} mins</CardText>
                        <CardText>Difficulty:{details.difficulty}</CardText>
                        <Button >Take this quiz!</Button>
                    </CardBody>
                </Card>

            </Fragment>
        )
    }
}

export default QuizCard;