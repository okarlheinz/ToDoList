import { db } from "./firebaseConfig"; // Importa o Firestore já configurado
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";

async function atualizarDatas() {
    const tarefasRef = collection(db, "tarefas"); // Nome da coleção
    const snapshot = await getDocs(tarefasRef);

    snapshot.forEach(async (tarefaDoc) => {
        const dados = tarefaDoc.data();

        // Verifica se a data está no formato string antes de atualizar
        if (typeof dados.data === "string") {
            try {
                const novoTimestamp = new Date(dados.data).getTime(); // Converte para timestamp

                // Atualiza o documento no Firestore
                await updateDoc(doc(db, "tarefas", tarefaDoc.id), { data: novoTimestamp });

                console.log(`✅ Documento ${tarefaDoc.id} atualizado: ${dados.data} → ${novoTimestamp}`);
            } catch (error) {
                console.error(`⚠️ Erro ao converter data: ${dados.data}`, error);
            }
        }
    });
}

// 🔥 Executa a atualização das datas
atualizarDatas().then(() => console.log("🚀 Atualização concluída!"));
