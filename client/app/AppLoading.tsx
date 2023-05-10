import loadingAnimation from 'assets/coursemology-loading.svg?url';

const AppLoading = (): JSX.Element => {
  return (
    <main className="flex h-screen w-screen items-center justify-center bg-neutral-200">
      <img alt="Loading" className="w-[20rem]" src={loadingAnimation} />
    </main>
  );
};

export default AppLoading;
