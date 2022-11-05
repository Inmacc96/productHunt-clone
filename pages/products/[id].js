import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Error404 from "../../components/Error404";
import Spinner from "../../components/Spinner";
import formatDistanceToNow from "date-fns/formatDistanceToNow";

import { getDatabyId } from "../../firebase";

import styles from "../../styles/Product.module.css";

const Product = () => {
  //Routing para obtener el id actual
  const router = useRouter();
  const {
    query: { id },
  } = router;

  //State product
  const [product, setProduct] = useState({});
  const [error, setError] = useState(false);

  useEffect(() => {
    //Nos vamos a esperar a que haya un id para realizar la consulta
    if (id) {
      const getProduct = async () => {
        const result = await getDatabyId(id);
        if (result.exists()) {
          setProduct(result.data());
        } else {
          setError(true);
        }
      };

      getProduct();
    }
  }, [id]);

  const { comments, created, description, company, name, url, image, votes } =
    product;

  if (Object.keys(product).length === 0) return <Spinner />;
  return (
    <>
      {error && <Error404 />}

      <div className={styles.container}>
        <h1 className={styles.title}>{name}</h1>

        <div className={styles.containerProduct}>
          <div>
            <p>Published ago: {formatDistanceToNow(new Date(created))}</p>
            <img src={image} />
            <p>{description}</p>

            <h2>Add your comment</h2>
            <form>
              <div className={styles.field}>
                <input type="text" name="message" />
              </div>

              <input
                type="submit"
                className={styles.inputSubmit}
                value="Add comment"
              />
            </form>

            <h2 className={styles.h2Comments}>Comments</h2>

            {comments.map((comment) => {
              <li>
                <p>{comment.name}</p>
                <p>Written by: {comment.username}</p>
              </li>;
            })}
          </div>

          <aside>
            <a
              className={`${styles.button} ${styles.buttonDark}`}
              href={url}
              target="_blank"
            >
              Visit URL
            </a>

            <div className={styles.divVotes}>
              <p className={styles.nVotes}>{votes} Votes</p>

              <a className={`${styles.button} ${styles.buttonLight}`}>Vote</a>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
};

export default Product;
