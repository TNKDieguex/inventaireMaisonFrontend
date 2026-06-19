
const FamilleItem = ({nom}:{
    nom: string
}) => {

    return (
        <div className="p-4 border border-gray-200 rounded-lg shadow-sm bg-gray-50">
            <p className="font-semibold text-gray-800">{nom}</p>
        </div>
    );
};

export default FamilleItem;