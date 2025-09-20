// src/components/Card.tsx
type Props = {
  letra: string;
  imagen: string;
};

export default function Card({ letra, imagen }: Props) {
  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition cursor-pointer">
      <img
        src={imagen}
        alt={`Seña para la letra ${letra}`}
        className="w-full h-40 object-cover rounded-t-2xl"
      />
      <div className="p-4 text-center">
        <span className="text-xl font-bold">{letra}</span>
      </div>
    </div>
  );
}
