#![cfg(test)]

use super::*;
use crate::{VoteContract, VoteContractClient};
use soroban_sdk::Env;

#[test]
fn vote_test() {
    let env = Env::default();
    let contract_id = env.register_contract(None, VoteContract); 
    let client = VoteContractClient::new(&env, &contract_id);
    assert_eq!(client.up_vote(), 1);
    assert_eq!(client.up_vote(), 2);
    log!(&env, "Upvote done");
    assert_eq!(client.down_vote(), 1);
    assert_eq!(client.down_vote(), 0);
    log!(&env,"{}" ,client.current_vote())
}
