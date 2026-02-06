export default function Home({ nom, prenom }: { nom: string; prenom: string }) {
  return (
    <div>
      <h1>Bienvenue sur la 🚀Home🚀</h1>
      <h2>
        mon nom : {nom} et mon prenom : {prenom}
      </h2>
      <label>
        Your first name:
        <input name="firstName" />
        <select>
          <option value="someOption">Some option</option>
          <option value="otherOption">Other option</option>
          <option value="apple">{nom}</option>
          <option value="banana">Banana</option>
          <option value="orange">Orange</option>
        </select>
      </label>
      <hr />
    </div>
  );
}
