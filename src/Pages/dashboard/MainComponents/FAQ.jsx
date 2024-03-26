import React, { useState, useEffect } from "react";
import Layout from "./Layout";
import { database } from "/src/utils/AppwriteConfig"; // Import your Appwrite database configuration

const FAQ = () => {
  const [faqs, setFaqs] = useState([]);
  const [currentFaq, setCurrentFaq] = useState({ question: "", answer: "" });
  const [editing, setEditing] = useState(false);

  // Function to fetch FAQs from Appwrite
  const fetchFaqs = () => {
    database.listDocuments("YOUR_FAQ_COLLECTION_ID").then(
      (response) => {
        console.log(response);
        setFaqs(response.documents);
      },
      (error) => {
        console.error(error);
      }
    );
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentFaq({ ...currentFaq, [name]: value });
  };

  const submitFaq = (e) => {
    e.preventDefault();
    if (currentFaq.$id) {
      // Edit operation
      database
        .updateDocument("YOUR_FAQ_COLLECTION_ID", currentFaq.$id, currentFaq)
        .then(
          () => {
            fetchFaqs();
            setCurrentFaq({ question: "", answer: "" });
            setEditing(false);
          },
          (error) => {
            console.error(error);
          }
        );
    } else {
      // Create operation
      database
        .createDocument("YOUR_FAQ_COLLECTION_ID", "unique()", currentFaq, [])
        .then(
          () => {
            fetchFaqs();
            setCurrentFaq({ question: "", answer: "" });
          },
          (error) => {
            console.error(error);
          }
        );
    }
  };

  const editFaq = (faq) => {
    setEditing(true);
    setCurrentFaq(faq);
  };

  const deleteFaq = (id) => {
    database.deleteDocument("YOUR_FAQ_COLLECTION_ID", id).then(
      () => {
        fetchFaqs();
      },
      (error) => {
        console.error(error);
      }
    );
  };

  return (
    <Layout>
      <div>
        <h2>{editing ? "Edit FAQ" : "Add FAQ"}</h2>
        <form onSubmit={submitFaq}>
          <input
            type="text"
            name="question"
            placeholder="FAQ Question"
            value={currentFaq.question}
            onChange={handleInputChange}
          />
          <textarea
            name="answer"
            placeholder="FAQ Answer"
            value={currentFaq.answer}
            onChange={handleInputChange}
          />
          <button type="submit">Submit</button>
        </form>
        <div>
          {faqs.map((faq) => (
            <div key={faq.$id}>
              <h3>{faq.question}</h3>
              <p>{faq.answer}</p>
              <button onClick={() => editFaq(faq)}>Edit</button>
              <button onClick={() => deleteFaq(faq.$id)}>Delete</button>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default FAQ;
