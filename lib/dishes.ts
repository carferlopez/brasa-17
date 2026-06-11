export type Dish = {
  id: string;
  name: string;
  image: string;
  copy: string;
};

export const DISHES: Dish[] = [
  {
    id: "01",
    name: "Pan y brasa",
    image: "pase-01.jpg",
    copy: "Masa madre de tres días, cocida directamente sobre la brasa hasta que la corteza cruje y huele a leña. Se sirve abierto, con mantequilla ahumada en frío y sal de las propias cenizas.",
  },
  {
    id: "02",
    name: "Puerro a la llama",
    image: "pase-02.jpg",
    copy: "El puerro entero, quemado hasta el negro absoluto. Dentro, confitado en su propio vapor: sedoso, dulce, intacto. Se come con cuchara, descartando lo carbonizado. El fuego como técnica, no como adorno.",
  },
  {
    id: "03",
    name: "Lubina al hueso",
    image: "pase-03.jpg",
    copy: "Lubina salvaje a la parrilla, entera y al hueso, como se ha hecho siempre en el Cantábrico. Piel crujiente, carne jugosa, y un refrito de su propio jugo, vinagre y ajo que se añade en la mesa.",
  },
  {
    id: "04",
    name: "Tuétano",
    image: "pase-04.jpg",
    copy: "Hueso de vaca vieja abierto a lo largo y asado hasta caramelizar. Sal gruesa, pimienta recién molida y pan quemado para untar. Lo más parecido a una mantequilla que da un animal.",
  },
  {
    id: "05",
    name: "Chuleta 60 días",
    image: "pase-05.jpg",
    copy: "Vaca vieja gallega con sesenta días de maduración en seco. Fuego vivo, costra oscura, interior rojo y templado. Reposa tanto tiempo como pasa sobre la brasa. Se corta y se comparte.",
  },
  {
    id: "06",
    name: "Pimientos del rescoldo",
    image: "pase-06.jpg",
    copy: "Pimientos enterrados en el rescoldo, donde ya no hay llama, solo calor. La piel se levanta sola. Aceite de oliva, sal en escamas y nada más. La guarnición que no sabe que es guarnición.",
  },
  {
    id: "07",
    name: "Helado de humo",
    image: "pase-07.jpg",
    copy: "Nata ahumada en frío durante doce horas, helada en mantecadora. Dulce al principio, hoguera al final. El último recuerdo del fuego, a tres grados bajo cero.",
  },
];
