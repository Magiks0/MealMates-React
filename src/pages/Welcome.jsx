import Navbar from "../components/common/navbar/Navbar";

const Welcome = () => {
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <div style={{ flex: 1, paddingBottom: "56px" }}>
        <h1>Bienvenue sur MealMates !</h1>
        <p>La plateforme qui lutte contre le gaspillage alimentaire.</p>
      </div>
      <Navbar />
    </div>
  );
};

export default Welcome;
