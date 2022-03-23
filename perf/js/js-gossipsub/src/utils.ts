import Libp2p, { Libp2pModules } from 'libp2p'
import { Multiaddr } from 'multiaddr'
import PeerId from 'peer-id'
import { NOISE } from '@chainsafe/libp2p-noise'
import Gossipsub from "libp2p-gossipsub"
// @ts-ignore
import WS from 'libp2p-websockets'
// @ts-ignore
import MPLEX from 'libp2p-mplex'
export { fromString as uint8ArrayFromString } from "uint8arrays/from-string"
export { toString as uint8ArrayToString } from "uint8arrays/to-string"

const defaultConfig = {
    modules: {
        transport: [WS],
        streamMuxer: [MPLEX],
        connEncryption: [NOISE],
        pubsub: Gossipsub,
    } as unknown as Libp2pModules,
    config: {
        pubsub: {
            enabled: true
        },
        peerDiscovery: {
            autoDial: false
        },
    }
}

function getListenAddress(peerId: PeerId) {
    return new Multiaddr('/ip4/127.0.0.1/tcp/0/ws')
}

export interface CreatePeerOptions {
    peerId?: PeerId,
    config?: Parameters<typeof Libp2p.create>[0],
}

export interface P2PNode {
    p: Libp2p,
    index: number,
    pid: String,
}

export async function createPeer(index: number, {
    peerId,
    config,
}: CreatePeerOptions = {}): Promise<P2PNode> {
    if (!peerId) {
        peerId = await PeerId.create()
    }
    const libp2p = await Libp2p.create({
        peerId: peerId,
        addresses: {
            listen: [getListenAddress(peerId) as any]
        },
        ...defaultConfig,
        ...config
    })
    await libp2p.start()
    return { index: index, p: libp2p, pid: libp2p.peerId.toB58String() }
}
