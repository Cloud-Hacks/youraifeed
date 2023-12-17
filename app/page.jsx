import Feed from "@components/Feed";

const Home = () => (
  <section className='w-full flex-center flex-col'>
    <h1 className='head_text text-center'>
    Discover & Store
      <br className='max-md:hidden' />
      <span className='blue_gradient text-center'> AI-Powered Prompts</span>
    </h1>
    <p className='desc text-center'>
      YourAIfeed is an open-source AI prompting tool for modern world to
      discover, create and store creative prompts
    </p>

    <Feed />
  </section>
);

export default Home;
