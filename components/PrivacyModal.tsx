import { Modal } from "./ui/Modal";
export function PrivacyModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  return <Modal open={open} onClose={onClose} title="Privacidade"><div className="space-y-4 leading-7"><p>Esta experiência não solicita nome, e-mail, telefone, localização ou conta em rede social.</p><p>Ao salvar sua foto, você autoriza o armazenamento na galeria privada do evento. Se a galeria pública estiver ativa, a foto poderá ser exibida durante a festa, conforme o modo de moderação definido pelo responsável.</p><p>Você pode tirar e baixar a foto sem criar cadastro. A câmera é usada apenas no seu aparelho e somente o resultado confirmado é enviado.</p></div></Modal>;
}
