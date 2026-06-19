
const FamilleItem = ({nom}:{
    nom: string
}) => {

    return (
        <div className="item">
            <p className="texte">{nom}</p>
        </div>
    );
};

export default FamilleItem;