import React, { Component, Fragment } from "react";
import { connect } from 'react-redux';
import { Card, CardBody,
} from 'reactstrap';
import './filters-mo.css';
import { setFilter } from '../../store/reducer/matchingOffers/actionCreator';

class FiltersMO extends Component {

    constructor() {
        super();
        this.state = {
            excludeSplit : false
        }
    }

    handleOnchange  =  event  => {
        this.setState((state, props) => {
            return {excludeSplit: !state.excludeSplit};
        }, () => {
            this.props.setFilter(this.state.excludeSplit);
        });
    }

    render(){
        return <Fragment>
            <Card className=" filter-container">
                <CardBody>
                <div className="filter-row">
                <div>
                    <h4>Filter:</h4>
                </div>
                <div class="form-check form-check-inline filter-radio">
                    <input class="form-check-input" type="checkbox" id="excludeSplit" onChange={this.handleOnchange} value="excludeSplit" />
                    <label class="form-check-label" for="excludeSplit">Exclude Split Matches</label>
                </div>
                </div>
            </CardBody>
            </Card>
        </Fragment>
    }
}

const mapStateToProps = (state) => {
    const isLoggedIn = state.userinfo.isLogin;
    const userId = state.userinfo.id;
    return { isLoggedIn, userId };
  }

  const mapDispatchToProps = (dispatch) => ({
    setFilter(excludeSplit) {
        dispatch(setFilter(excludeSplit));
    }
})

export default connect(mapStateToProps,mapDispatchToProps)(FiltersMO);