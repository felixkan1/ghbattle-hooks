import * as React from 'react'
import { battle } from '../utils/api'
import { FaCompass, FaBriefcase, FaUsers, FaUserFriends, FaCode, FaUser } from 'react-icons/fa'
import Card from './Card'
import PropTypes from 'prop-types'
import Loading from './Loading'
import Tooltip from './Tooltip'
import queryString from 'query-string'
import { Link } from 'react-router-dom'

function ProfileList ({ profile }) {
  return (
    <ul className='card-list'>
      <li>
        <Tooltip text="Github User">
          <FaUser color='rgb(239, 115,115' size={22}/>
          {profile.name}
        </Tooltip>
      </li>
      {profile.location &&(
        <li>
          <FaCompass color='rgb(144,115,225' size={22} />
          {profile.location}
        </li>
      )}
      {profile.company &&(
        <li>
          <FaBriefcase color='#795548' size={22} />
          {profile.location}
        </li>
      )}
      <li>
        <FaUsers color='rgb(129, 195,245)' size={22} />
        {profile.followers} followers
      </li>
      <li>
        <FaUserFriends color='rbg(64,183,95)' size={22}/>
        {profile.following} following
      </li>
  </ul>
  )
}

ProfileList.propTypes={
  profile: PropTypes.object.isRequired
}




export default class Results extends React.Component{

  state = {
    winner:null, 
    loser:null,
    error:null, 
    loading:true
  }

  componentDidMount() {

    //parseString turns query string into a key value pair
    const {playerOne, playerTwo} = queryString.parse(this.props.location.search)

    battle([ playerOne, playerTwo])
      .then((players) => {
        this.setState({
          winner: players[0],
          loser: players[1],
          error: null,
          loading: false
        })
      }).catch(({ message }) => {
        this.setState({
          error: message,
          loading: false
        })
      })
  }

  render(){
    const { winner, loser, error, loading } = this.state
    if(loading === true){
      return <Loading text='Battling' speed ={100}/>
    }

    if(error) {
      return (
        <p className ='center-text error'>{error}</p>
      )
    }
    //if no error and not loading
    return (
      <React.Fragment>
          <div className = 'grid space-around container-sm'>
            <Card 
              header={winner.score === loser.score? 'Tie' : 'Winner'}
              subheader={`Score: ${winner.score}`}
              avatar={winner.profile.avatar_url}
              href={winner.profile.html_url}
              name={winner.profile.login}
            >
            <ProfileList profile={winner.profile}/>
            
            </Card>
            
            <Card 
              header={winner.score === loser.score? 'Tie' : 'Loser'}
              subheader={`Score: ${loser.score}`}
              avatar={loser.profile.avatar_url}
              href={loser.profile.html_url}
              name={loser.profile.login}
            >
            <ProfileList profile={loser.profile}/>
            </Card>

          </div> 
          <Link
            to = '/battle'
            className='btn dark-btn btn-space'
          >
            Reset
          </Link>


      </React.Fragment>
    )
  }
}

