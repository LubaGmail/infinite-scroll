import React from 'react'
import fetch from 'isomorphic-fetch'
import Contact from './contact'

class ContactList extends React.Component {
  state = {
    contacts: [],
    per: 8,
    page: 1,
    totalPages: null,
    scrolling: false,
  }

  componentDidMount() {
    this.loadContacts()
    this.scrollListener = window.addEventListener('scroll', (e) => {
      this.handleScroll(e)
    })
  }
  
  handleScroll = () => {
    const { scrolling, totalPages, page} = this.state
    if (scrolling) return
    if (page >= totalPages) return
    // Both let and const are block scope
    // 
    let lastLi = document.querySelector('ul.contacts > li:last-child')

    // handleScroll 1192      1060        132
    // handleScroll 2312      2180        132
    // handleScroll 3432      3300        
    // handleScroll 4552      4420        132
    let lastLiOffset = lastLi.offsetTop + lastLi.clientHeight
    
    // handleScroll 632       6             626
    // handleScroll 657       31            626
    // handleScroll 705       79            626
    // handleScroll 910       284           626
    let pageOffset = window.pageYOffset + window.innerHeight
    
    let bottomOffset = 20
    // 1047           1192            20
    // 1049           1192            20
    // 1058           1192            20
    // 1108           1192            20
    if (pageOffset > lastLiOffset - bottomOffset) {
      this.loadMore()
    }
    
  }

  loadContacts = () => {
    const { per, page, contacts } = this.state
    const url = `https://student-example-api.herokuapp.com/v1/contacts.json?per=${per}&page=${page}`
    fetch(url)
      .then(response => response.json())
      .then(json => this.setState({
        contacts: [...contacts, ...json.contacts],
        scrolling: false,
        totalPages: json.total_pages,
      }))
  }

  loadMore = () => {
    this.setState(prevState => ({
      page: prevState.page+1,
      scrolling: true,
    }), this.loadContacts)
  }

  render() {
    return <ul className="contacts contact-container">
      {
        this.state.contacts.map(contact => <li key={contact.id}>
          <Contact {...contact} />
        </li>)
      }
    </ul>
  }
}

export default ContactList