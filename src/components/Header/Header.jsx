import React, { useEffect, useState } from 'react'
import { Link, useLocation, useMatch, useNavigate } from 'react-router-dom'

import { useSelector, useDispatch } from 'react-redux'
import { setMovieType } from 'redux/actions/movieActions'
import { searchMovies } from 'redux/actions/searchActions'

import { formatHeaderItems } from 'utils'

import logo from 'assets/cinema-logo.svg'
import 'components/Header/Header.scss'

const HEADER_LIST = [
  {
    id: 1,
    iconClass: 'fas fa-film',
    type: 'now_playing'
  },
  {
    id: 2,
    iconClass: 'fas fa-fire',
    type: 'popular'
  },
  {
    id: 3,
    iconClass: 'fas fa-star',
    type: 'top_rated'
  },
  {
    id: 4,
    iconClass: 'fas fa-plus-square',
    type: 'upcoming'
  }
]

const Header = () => {
  const dispatch = useDispatch()
  const { movieType } = useSelector((state) => state.movieList)

  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [term, setTerm] = useState('')
  const [debouncedTerm, setDebouncedTerm] = useState(term)
  const [disableSearchInput, setDisableSearchInput] = useState(false)
  const [showHeader, setShowHeader] = useState(true)

  const navigate = useNavigate()
  const location = useLocation()
  const matchDetailsRoute = useMatch('/:id/:name/details')

  const toggleMenu = () => setIsMenuOpen((prev) => !prev)

  const handleClick = (type) => {
    isMenuOpen && toggleMenu()
    dispatch(setMovieType(type))
    /* navigate is used to leave Details.jsx back to Main.jsx */
    navigate('/')
  }

  const handleChange = (event) => setTerm((prev) => event.target.value)

  /* Debounce Search Triggering */
  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedTerm(term)
    }, 1000)

    return () => clearTimeout(timerId)
  }, [term])

  useEffect(() => {
    dispatch(searchMovies(debouncedTerm))
  }, [debouncedTerm])

  /* Handle menu opening */
  useEffect(() => {
    if (isMenuOpen) {
      document.body.classList.add('header-nav-open')
    } else {
      document.body.classList.remove('header-nav-open')
    }
  }, [isMenuOpen])

  /* Disable search input in Details pages */
  useEffect(() => setDisableSearchInput((prev) => location.pathname !== '/'), [location.pathname])

  /* Hide header in error screen
   * (ie nor in MainScreen nor in DetailsScreen)
   */
  useEffect(
    () => setShowHeader((prev) => matchDetailsRoute || location.pathname === '/'),
    [location.pathname]
  )

  return (
    <>
      {showHeader && (
        <div className="header-nav-wrapper">
          <div className="header-bar"></div>
          <div className="header-navbar">
            <Link to="/">
              <div className="header-image">
                <img src={logo} alt="" />
              </div>
            </Link>

            <div
              className={`${isMenuOpen ? 'header-menu-toggle is-active' : 'header-menu-toggle'}`}
              id="header-mobile-menu"
              onClick={toggleMenu}
            >
              <span className="bar"></span>
              <span className="bar"></span>
              <span className="bar"></span>
            </div>

            <ul className={`${isMenuOpen ? 'header-nav header-mobile-nav' : 'header-nav'}`}>
              {HEADER_LIST.map(({ id, iconClass, type }) => (
                <li
                  key={id}
                  className={movieType === type ? 'header-nav-item active-item' : 'header-nav-item'}
                  onClick={() => handleClick(type)}
                >
                  <span className="header-list-name">
                    <i className={iconClass} />
                  </span>
                  &nbsp;
                  <span className="header-list-name">{formatHeaderItems(type)}</span>
                </li>
              ))}

              <input
                className={`search-input ${disableSearchInput ? 'disabled' : ''}`}
                onChange={handleChange}
                placeholder="Search for a movie"
                type="text"
                value={term}
              />
            </ul>
          </div>
        </div>
      )}
    </>
  )
}

export default Header
