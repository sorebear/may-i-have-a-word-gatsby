import React, { Component } from 'react';

class NewChapterModal extends Component {
  constructor(props) {
    super(props);
    this.closeModal = this.closeModal.bind(this);
    this.updateChapterTitle = this.updateChapterTitle.bind(this);
    this.state = {
      chapterTitle: ''
    }
  }

  closeModal() {
    const { hideModal } = this.props;
    this.setState({ chapterTitle: '' })
    hideModal();
  }

  updateChapterTitle(e) {
    this.setState({ chapterTitle: e.target.value });
  }

  render() {
    const { chapterTitle } = this.state;
    const { onSubmit, hideModal } = this.props;
    return (
      <div className="modal-card">
        <form onSubmit={(e) => onSubmit(e, chapterTitle)}>
          <header className="modal-card-head justify-between">
            <p className="modal-card-title">Create New Chapter</p>
            <button 
              type="button"
              className="delete"
              onClick={this.closeModal}
            />
          </header>
          <section className="modal-card-body">
            <h3 className="title">Chapter Title</h3>
            <input 
              type="text"
              className="input"
              name="new-chapter-title"
              onChange={this.updateChapterTitle}
              value={chapterTitle}
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

export default NewChapterModal;