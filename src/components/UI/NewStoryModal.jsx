import React, { Component } from 'react';

class NewStoryModal extends Component {
  constructor(props) {
    super(props);
    this.closeModal = this.closeModal.bind(this);
    this.updateNewStoryTitle = this.updateNewStoryTitle.bind(this);
    this.state = {
      newStoryTitle: '',
    }
  }

  closeModal() {
    const { hideModal } = this.props;
    this.setState({ newStoryTitle: '' });
    hideModal();
  }

  updateNewStoryTitle(e) {
    this.setState({ newStoryTitle: e.target.value });
  }

  render() {
    const { onSubmit } = this.props;
    const { newStoryTitle } = this.state;
    return(
      <div className="modal-card">
        <form
          onSubmit={(e) => onSubmit(e, newStoryTitle)}
        >
          <header className="modal-card-head justify-between">
            <p className="modal-card-tile">Create New Story</p>
            <button
              type="button"
              className="delete"
              aria-label="close"
              onClick={this.closeModal}
            />
          </header>
          <section className="modal-card-body has-text-centered">
            <h3 className="title">Story Title</h3>
            <input 
              className="input"
              type="text"
              onChange={this.updateNewStoryTitle}
              value={newStoryTitle}
              name="story-title"
              required
            />
          </section>
          <footer className="modal-card-foot justify-center">
            <button 
              className="button"
              type="submit"
            >
              Create
            </button>
          </footer>
        </form>
      </div>
    )
  }
}

export default NewStoryModal;