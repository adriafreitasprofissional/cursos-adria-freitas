"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

interface Curso {
  id: string;
  titulo: string;
  descricao: string;
  imagem_url: string;
}

export default function MeusCursosPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
const [cursos, setCursos] = useState<Curso[]>([]);
const [nome, setNome] = useState("Olá");
const [produto, setProduto] = useState("");

  useEffect(() => {
    carregarCursos();
  }, []);

  async function carregarCursos() {
 
  const slug = new URLSearchParams(window.location.search).get("slug");

if (!slug) {
  setLoading(false);
  return;
}

if (!slug) {
  window.location.href = "https://www.magiaoriente.com.br";
  return;
}

  // Primeiro tenta localizar um assinante
let nomeUsuario = "";
let emailUsuario = "";
let clubClientId: string |null = null;

const { data: cursosData, error: erroCursos } = await supabase
  .from("club_clients")
  .select("*")
  .eq("slug", slug)
  .maybeSingle();

console.log(cursosData);
console.log(erroCursos);

console.log("SLUG:", slug);
console.log("CURSOS:", cursosData);
console.log("ERRO CURSOS:", erroCursos);



if (cursosData) {
  setProduto(cursosData.produto ?? "");
  nomeUsuario = cursosData.nome;
  emailUsuario = cursosData.email;
  clubClientId = cursosData.id;
} else {

  // Se não encontrou, tenta localizar um aluno externo
  const { data: aluno } = await supabase
    .from("course_students")
    .select("id,nome,email")
    .eq("slug", slug)
    .maybeSingle();

  if (!aluno) {
    setLoading(false);
    return;
  }

  nomeUsuario = aluno.nome;
  emailUsuario = aluno.email;
}

const primeiroNome = nomeUsuario.split(" ")[0];

setNome(
  primeiroNome.charAt(0).toUpperCase() +
  primeiroNome.slice(1).toLowerCase()

);

  const filtro = clubClientId
  ? `club_client_id.eq.${clubClientId},email.eq.${emailUsuario}`
  : `email.eq.${emailUsuario}`;

const { data: alunos, error: erroAlunos } = await supabase
  .from("course_students")
  .select("*")
  .or(filtro);

  
console.log("CURSOS:", cursos);
console.log("ALUNOS:", alunos);
console.log("ERRO ALUNOS:", erroAlunos);

if (!alunos || alunos.length === 0) {
  setCursos([]);
  setLoading(false);
  return;
}

console.log({
  slug,
  cursos,
  clubClientId,
  emailUsuario,
  filtro,
  alunos,
  cursos,
});

  const ids = alunos
  .map((item) => item.course_id)
  .filter(Boolean);

const { data: cursos, error } = await supabase
  .from("courses")
  .select("*")
  .in("id", ids);

if (error) {
  console.error(error);
}

setCursos(cursos || []);
setLoading(false);
}

 function voltarPortal() {
  const slug = new URLSearchParams(window.location.search).get("slug");
  
console.log("SLUG:", slug);
console.log("PRODUTO:", produto);

  if (!slug) {
    window.location.href = "https://www.magiaoriente.com.br";
    return;
  }

  if (produto === "Cursos") {
    window.location.href = `https://www.magiaoriente.com.br/minha-area-alunos-externos?slug=${slug}`;
    return;
  }

  window.location.href = `https://www.magiaoriente.com.br/cliente/${slug}`;
}
  return (
    <main className="min-h-screen bg-[#140B1D] text-white">
      <div className="flex min-h-screen flex-col lg:flex-row">
        
<aside className="
w-full
lg:w-72
bg-[#1A0E25]
border-b
lg:border-b-0
lg:border-r
border-yellow-600/20
p-6
lg:p-8
">

          <h1 className="text-2xl md:text-3xl font-bold text-yellow-400">ÁREA DO ALUNO</h1>
          <p className="mt-2 text-sm text-gray-400">Área de Estudos</p>

          <div className="mt-12 rounded-2xl bg-yellow-500/10 border border-yellow-500/30 p-5">
            <p className="text-sm text-gray-300">Parabéns</p>
            <h2 className="mt-2 text-xl md:text-2xl font-bold">{nome}</h2>
          </div>

          <button

  onClick={voltarPortal}
  className="mt-16 w-full rounded-xl border border-yellow-500 py-4 font-semibold text-yellow-400 transition hover:bg-yellow-500 hover:text-[#140B1D]"
>
  ← Voltar ao Portal
</button>
        </aside>

        <section className="flex-1 overflow-auto">
          <div className="mx-auto max-w-7xl px-5 md:px-8 lg:px-12 py-8 md:py-12">
            <h1 className="text-3xl md:text-4xl lg:text-6xl font-black text-yellow-400 leading-tight">
  Meus Cursos
</h1>
            <p className="mt-4 text-base md:text-lg lg:text-xl leading-7 text-gray-300">
              O conhecimento liberta.
            </p>

            <div className="mt-8 md:mt-12">
              {cursos.length === 0 ? (
                <div className="rounded-3xl border border-yellow-500/20 bg-[#241236] p-16 text-center">
                  <h2 className="text-3xl font-bold text-yellow-400">
                    Nenhum curso liberado
                  </h2>
                </div>
              ) : (
                cursos.map((curso) => (
                  <Link
                    key={curso.id}
                    href="/cursos/pombogira"
                    className="block mb-10"
                  >
                    <div className="overflow-hidden rounded-[32px] border border-yellow-500/20 bg-[#241236] shadow-2xl transition duration-300 hover:-translate-y-1 hover:border-yellow-500/60">
                      <div className="relative">
                        
                        {/* Desktop */}
<img
  src="/images/courses/desafio-pombagira/banner-desafio-login.png"
  alt={curso.titulo}
  className="hidden md:block w-full h-[420px] object-cover"
/>

{/* Mobile */}
<img
  src="/images/courses/desafio-pombagira/banner-desafio-login-mob.png"
  alt={curso.titulo}
  className="block md:hidden w-full object-cover"
/>

                        <div className="absolute inset-0 bg-gradient-to-t from-[#140B1D] via-transparent to-transparent" />
                        <div className="absolute bottom-8 left-8">
                          <span className="rounded-full bg-yellow-500 px-5 py-2 text-sm font-bold text-[#140B1D]">
                            CURSO LIBERADO
                          </span>
                        </div>
                      </div>

                     <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-6 lg:gap-10 p-6 lg:p-12">
                        <div>
                         <p className="uppercase tracking-[0.2em] text-xs md:text-sm text-purple-300">
                            Desenvolvimento Espiritual
                          </p>

                          <h2 className="mt-4 text-2xl md:text-3xl lg:text-5xl font-black text-yellow-400 leading-tight">
                            {curso.titulo}
                          </h2>

                         <p className="mt-6 max-w-3xl text-base md:text-lg lg:text-xl leading-7 md:leading-8 text-gray-300">
                            {curso.descricao}
                          </p>
                        </div>

                        <div className="flex flex-col justify-center">
                          <div className="rounded-2xl border border-yellow-500/20 bg-[#1A0E25] p-6 lg:p-8">
                            <p className="text-gray-400">Status</p>
                            <h3 className="mt-3 text-2xl md:text-3xl font-bold text-green-400">
                              Liberado
                            </h3>

                            <div className="mt-8 w-full rounded-2xl bg-yellow-500 py-4 md:py-5 text-center text-base md:text-lg font-bold text-[#140B1D]">
                              Continuar Curso →
                            </div>
                          </div>
                        </div>
                      </div>

                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
