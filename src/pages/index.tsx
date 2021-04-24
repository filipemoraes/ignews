
import { GetServerSideProps, GetStaticProps } from 'next';
import Head from 'next/head';
import { SubscribeButton } from '../components/SubscribeButton';
import styles from '../styles/pages/index.module.scss';
import { stripe } from '../services/stripe';

interface HomeProps {
  product: {
    priceId: string;
    amount: number;
  }
}

export default function Home({ product }: HomeProps) {
  return (
    <>
      <Head>
        <title>Home | ig.news</title>
      </Head>
      <main className={styles.contentContainer}>
        <section className={styles.hero}>
          <span>👏 Hey, welcome</span>
          <h1>News about the <span>React</span> wold</h1>
          <p>
            Get access to all the publication <br/>
            <span>for {product.amount} month</span>
          </p>
          <SubscribeButton priceId={product.priceId} />
        </section>

        <img src="/images/avatar.svg" alt="Girl coding" />
      </main>
    </>
  )
}

//SSR (server side rendering)
//Se não tem necessidade como SEO, a chamada não precisa ser feita pelo nextjs.
//Nesse caso mais vale fazer uma chamada assincrina com o Axios/Rxjs no componente.
// export const getServerSideProps: GetServerSideProps = async () => {
//   const price = await stripe.prices.retrieve('price_1Ie8FYIrq9o6CFpIkSIKINov');

//   const product = {
//     priceId: price.id,
//     amount: new Intl.NumberFormat('en-US', {
//       style: 'currency',
//       currency: 'USD'
//     }).format(price.unit_amount / 100)
//   }

//   return {
//     props: {
//       product: product
//     }
//   }
// }

//SSG (static site generator)
//Quando a página pode ser compartilhada por todos ou quando há necessidade de SEO
export const getStaticProps: GetStaticProps = async () => {
  const price = await stripe.prices.retrieve(process.env.STRIPE_SUBSCRIPTION_ID);

  const product = {
    priceId: price.id,
    amount: new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price.unit_amount / 100)
  }

  return {
    props: {
      product: product
    },
    revalidate: 60 * 60 * 24, //24 hours
  }
}
