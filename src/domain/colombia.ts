// Catálogo geográfico de clínicas de Colombia: Departamento → Ciudad → Clínicas.
// Lista curada y extensa (no exhaustiva) de las principales instituciones por
// ciudad. Ampliable sin tocar los módulos que la consumen. El formulario ofrece
// además una opción "Otra clínica…" para nombres que no estén en el catálogo.

export interface CityCatalog {
  city: string;
  clinics: string[];
}

export interface DepartmentCatalog {
  department: string;
  cities: CityCatalog[];
}

export const COLOMBIA_CLINICS: DepartmentCatalog[] = [
  {
    department: "Amazonas",
    cities: [
      { city: "Leticia", clinics: ["Hospital San Rafael de Leticia", "Clínica Leticia"] },
    ],
  },
  {
    department: "Antioquia",
    cities: [
      {
        city: "Medellín",
        clinics: [
          "Hospital Pablo Tobón Uribe",
          "Clínica Las Américas",
          "Clínica Medellín",
          "Clínica El Rosario",
          "Clínica CES",
          "Clínica SOMA",
          "Clínica Cardiovascular Santa María",
          "Hospital General de Medellín",
          "Hospital San Vicente Fundación",
          "Clínica Universitaria Bolivariana",
        ],
      },
      { city: "Envigado", clinics: ["Clínica Las Vegas", "Hospital Manuel Uribe Ángel"] },
      { city: "Rionegro", clinics: ["Hospital San Vicente Fundación Rionegro", "Clínica Somer"] },
      { city: "Bello", clinics: ["Clínica del Norte"] },
      { city: "Itagüí", clinics: ["Hospital San Rafael de Itagüí"] },
    ],
  },
  {
    department: "Arauca",
    cities: [
      { city: "Arauca", clinics: ["Hospital San Vicente de Arauca"] },
      { city: "Saravena", clinics: ["Hospital del Sarare"] },
    ],
  },
  {
    department: "Atlántico",
    cities: [
      {
        city: "Barranquilla",
        clinics: [
          "Clínica General del Norte",
          "Clínica Portoazul",
          "Clínica La Asunción",
          "Clínica del Caribe",
          "Clínica Reina Catalina",
          "Clínica Iberoamérica",
          "Clínica Bautista",
          "Hospital Universitario CARI",
          "Clínica Los Nogales",
        ],
      },
      { city: "Soledad", clinics: ["Clínica Materno Infantil Adela de Char"] },
    ],
  },
  {
    department: "Bogotá D.C.",
    cities: [
      {
        city: "Bogotá",
        clinics: [
          "Fundación Santa Fe de Bogotá",
          "Clínica del Country",
          "Clínica Marly",
          "Fundación Cardioinfantil",
          "Hospital Universitario San Ignacio",
          "Clínica Universitaria Colombia",
          "Clínica Reina Sofía",
          "Hospital Militar Central",
          "Clínica de la Mujer",
          "Clínica Palermo",
          "Fundación Clínica Shaio",
          "Clínica Nueva",
          "Hospital El Tunal",
        ],
      },
    ],
  },
  {
    department: "Bolívar",
    cities: [
      {
        city: "Cartagena",
        clinics: [
          "Hospital Universitario del Caribe",
          "Nuevo Hospital Bocagrande",
          "Clínica Universitaria San Juan de Dios",
          "Hospital Naval de Cartagena",
          "Clínica Madre Bernarda",
          "Clínica Blas de Lezo",
          "Clínica Gestión Salud",
        ],
      },
      { city: "Magangué", clinics: ["Hospital La Divina Misericordia"] },
    ],
  },
  {
    department: "Boyacá",
    cities: [
      {
        city: "Tunja",
        clinics: ["Hospital Universitario San Rafael de Tunja", "Clínica Medilaser Tunja", "Clínica Los Andes"],
      },
      { city: "Sogamoso", clinics: ["Hospital Regional de Sogamoso", "Clínica Los Andes Sogamoso"] },
      { city: "Duitama", clinics: ["Hospital Regional de Duitama"] },
    ],
  },
  {
    department: "Caldas",
    cities: [
      {
        city: "Manizales",
        clinics: [
          "SES Hospital Universitario de Caldas",
          "Clínica San Marcel",
          "Hospital Santa Sofía",
          "Clínica Versalles",
          "Clínica La Presentación",
        ],
      },
    ],
  },
  {
    department: "Caquetá",
    cities: [
      { city: "Florencia", clinics: ["Hospital Universitario María Inmaculada", "Clínica Medilaser Florencia"] },
    ],
  },
  {
    department: "Casanare",
    cities: [
      { city: "Yopal", clinics: ["Hospital Regional de la Orinoquía", "Clínica Casanare"] },
    ],
  },
  {
    department: "Cauca",
    cities: [
      {
        city: "Popayán",
        clinics: [
          "Hospital Universitario San José",
          "Clínica La Estancia",
          "Clínica Nuestra Señora de los Remedios",
          "Hospital Susana López de Valencia",
        ],
      },
    ],
  },
  {
    department: "Cesar",
    cities: [
      {
        city: "Valledupar",
        clinics: [
          "Clínica Laura Daniela",
          "Clínica del César",
          "Hospital Rosario Pumarejo de López",
          "Clínica Médicos",
          "Clínica Erasmo",
        ],
      },
    ],
  },
  {
    department: "Chocó",
    cities: [
      { city: "Quibdó", clinics: ["Hospital San Francisco de Asís", "Clínica Vida"] },
    ],
  },
  {
    department: "Córdoba",
    cities: [
      {
        city: "Montería",
        clinics: [
          "Clínica Zayma",
          "IMAT Oncomédica",
          "Hospital San Jerónimo de Montería",
          "Clínica Montería",
          "Clínica Salud Social",
        ],
      },
    ],
  },
  {
    department: "Cundinamarca",
    cities: [
      { city: "Chía", clinics: ["Clínica Universidad de La Sabana"] },
      { city: "Soacha", clinics: ["Hospital Mario Gaitán Yanguas"] },
      { city: "Zipaquirá", clinics: ["Hospital Universitario de la Samaritana - Zipaquirá"] },
      { city: "Girardot", clinics: ["Hospital Universitario de La Samaritana - Girardot", "Clínica San Sebastián"] },
      { city: "Facatativá", clinics: ["Hospital San Rafael de Facatativá"] },
    ],
  },
  {
    department: "Guainía",
    cities: [
      { city: "Inírida", clinics: ["Hospital Manuel Elkin Patarroyo"] },
    ],
  },
  {
    department: "Guaviare",
    cities: [
      { city: "San José del Guaviare", clinics: ["Hospital San José del Guaviare"] },
    ],
  },
  {
    department: "Huila",
    cities: [
      {
        city: "Neiva",
        clinics: [
          "Hospital Universitario Hernando Moncaleano Perdomo",
          "Clínica Medilaser Neiva",
          "Clínica Uros",
          "Clínica Emcosalud",
        ],
      },
    ],
  },
  {
    department: "La Guajira",
    cities: [
      { city: "Riohacha", clinics: ["Hospital Nuestra Señora de los Remedios", "Clínica Riohacha"] },
      { city: "Maicao", clinics: ["Hospital San José de Maicao"] },
    ],
  },
  {
    department: "Magdalena",
    cities: [
      {
        city: "Santa Marta",
        clinics: [
          "Clínica El Prado",
          "Clínica Mar Caribe",
          "Hospital Universitario Fernando Troconis",
          "Clínica La Milagrosa",
          "Clínica Los Ángeles",
        ],
      },
    ],
  },
  {
    department: "Meta",
    cities: [
      {
        city: "Villavicencio",
        clinics: ["Clínica Martha", "Hospital Departamental de Villavicencio", "Clínica Meta", "Clínica Palma Real"],
      },
    ],
  },
  {
    department: "Nariño",
    cities: [
      {
        city: "Pasto",
        clinics: [
          "Hospital Universitario Departamental de Nariño",
          "Clínica Nuestra Señora de Fátima",
          "Clínica Los Andes",
          "Clínica Hispanoamérica",
        ],
      },
      { city: "Ipiales", clinics: ["Hospital Civil de Ipiales"] },
    ],
  },
  {
    department: "Norte de Santander",
    cities: [
      {
        city: "Cúcuta",
        clinics: [
          "Hospital Universitario Erasmo Meoz",
          "Clínica Medical Duarte",
          "Clínica San José de Cúcuta",
          "Clínica Norte",
          "Clínica Santa Ana",
        ],
      },
    ],
  },
  {
    department: "Putumayo",
    cities: [
      { city: "Mocoa", clinics: ["Hospital José María Hernández"] },
      { city: "Puerto Asís", clinics: ["Hospital Local de Puerto Asís"] },
    ],
  },
  {
    department: "Quindío",
    cities: [
      {
        city: "Armenia",
        clinics: [
          "Clínica La Sagrada Familia",
          "Hospital San Juan de Dios",
          "Clínica Central del Quindío",
          "Clínica Los Nogales Armenia",
        ],
      },
    ],
  },
  {
    department: "Risaralda",
    cities: [
      {
        city: "Pereira",
        clinics: [
          "Clínica Comfamiliar",
          "Hospital Universitario San Jorge",
          "Clínica Los Rosales",
          "Clínica SES Pereira",
        ],
      },
      { city: "Dosquebradas", clinics: ["Clínica del Café"] },
    ],
  },
  {
    department: "San Andrés y Providencia",
    cities: [
      { city: "San Andrés", clinics: ["Hospital Clarence Lynd Newball Memorial"] },
    ],
  },
  {
    department: "Santander",
    cities: [
      {
        city: "Bucaramanga",
        clinics: [
          "Fundación Cardiovascular de Colombia (Instituto del Corazón)",
          "Clínica Chicamocha",
          "Clínica Bucaramanga",
          "Hospital Universitario de Santander",
          "Clínica Materno Infantil San Luis",
        ],
      },
      {
        city: "Floridablanca",
        clinics: ["Clínica FOSCAL", "Clínica FOSCAL Internacional", "Clínica FOSUNAB"],
      },
      {
        city: "Barrancabermeja",
        clinics: ["Clínica San Nicolás", "Hospital Regional del Magdalena Medio"],
      },
    ],
  },
  {
    department: "Sucre",
    cities: [
      {
        city: "Sincelejo",
        clinics: ["Clínica Santa María", "Hospital Universitario de Sincelejo", "Clínica Las Peñitas", "Clínica Medihelp"],
      },
    ],
  },
  {
    department: "Tolima",
    cities: [
      {
        city: "Ibagué",
        clinics: ["Hospital Federico Lleras Acosta", "Clínica Medicádiz", "Clínica Tolima", "Medicáncer"],
      },
    ],
  },
  {
    department: "Valle del Cauca",
    cities: [
      {
        city: "Cali",
        clinics: [
          "Fundación Valle del Lili",
          "Clínica Imbanaco",
          "Clínica de Occidente",
          "Clínica Colombia",
          "Hospital Universitario del Valle",
          "Clínica Sebastián de Belalcázar",
          "Clínica Farallones",
          "Clínica Nuestra Señora de los Remedios",
          "Clínica Rey David",
        ],
      },
      { city: "Palmira", clinics: ["Clínica Palmira", "Hospital San Vicente de Paúl"] },
      { city: "Tuluá", clinics: ["Hospital Tomás Uribe Uribe", "Clínica San Francisco Tuluá"] },
      { city: "Buga", clinics: ["Hospital San José de Buga"] },
      { city: "Buenaventura", clinics: ["Hospital Departamental de Buenaventura"] },
    ],
  },
  {
    department: "Vaupés",
    cities: [
      { city: "Mitú", clinics: ["Hospital San Antonio de Mitú"] },
    ],
  },
  {
    department: "Vichada",
    cities: [
      { city: "Puerto Carreño", clinics: ["Hospital San Juan de Dios de Puerto Carreño"] },
    ],
  },
];

/** Sentinel used by the form when the doctor picks "Otra clínica…". */
export const OTRA_CLINICA = "__otra__";

export function departamentos(): string[] {
  return COLOMBIA_CLINICS.map((d) => d.department);
}

export function ciudadesDe(departamento: string): string[] {
  const dep = COLOMBIA_CLINICS.find((d) => d.department === departamento);
  return dep ? dep.cities.map((c) => c.city) : [];
}

export function clinicasDe(departamento: string, ciudad: string): string[] {
  const dep = COLOMBIA_CLINICS.find((d) => d.department === departamento);
  const city = dep?.cities.find((c) => c.city === ciudad);
  return city ? city.clinics : [];
}
