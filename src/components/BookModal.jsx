import { useEffect, useState } from "react";

function BookModal({ book, close }) {
  const [workData, setWorkData] = useState(null);
  const [editionData, setEditionData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!book) return;

    const fetchDetails = async () => {
      setLoading(true);

      try {
        // 1️⃣ Work API
        const workRes = await fetch(
          `https://openlibrary.org${book.key}.json`
        );
        const workJson = await workRes.json();
        setWorkData(workJson);

        // 2️⃣ Editions API
        const editionRes = await fetch(
          `https://openlibrary.org${book.key}/editions.json?limit=1`
        );
        const editionJson = await editionRes.json();
        setEditionData(editionJson.entries?.[0]);
      } catch (err) {
        console.error(err);
      }

      setLoading(false);
    };

    fetchDetails();
  }, [book]);

  if (!book) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <button className="close-btn" onClick={close}>❌</button>

        <h2>{book.title}</h2>
        <p><b>Author:</b> {book.author_name?.[0] || "Unknown"}</p>

        {loading && <p>Loading details...</p>}

        {!loading && (
          <>
            <p>
              <b>Description:</b>{" "}
              {typeof workData?.description === "string"
                ? workData.description
                : workData?.description?.value || "Not available"}
            </p>

            <p>
              <b>Publisher:</b>{" "}
              {editionData?.publishers?.[0] || "Not available"}
            </p>

            <p>
              <b>Pages:</b>{" "}
              {editionData?.number_of_pages || "Not available"}
            </p>

            <p>
              <b>Subjects:</b>{" "}
              {workData?.subjects?.slice(0, 5).join(", ") || "Not available"}
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export default BookModal;
